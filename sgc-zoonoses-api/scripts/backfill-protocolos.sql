
BEGIN;

-- Verifica se existe algum serviço inesperado nas solicitações antigas.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM solicitacoes s
    INNER JOIN servicos sv ON sv.id = s."servicoId"
    WHERE s.protocolo IS NULL
      AND LOWER(TRIM(sv.nome)) NOT IN (
        'castração',
        'atendimento veterinário',
        'outros procedimentos',
        'vacinação'
      )
  ) THEN
    RAISE EXCEPTION
      'Existe solicitação vinculada a um serviço sem prefixo configurado.';
  END IF;
END $$;

-- Identifica os prefixos e os números já utilizados.
WITH protocolos_existentes AS (
  SELECT
    "organizacaoId",
    SPLIT_PART(protocolo, '-', 1) AS prefixo,
    SPLIT_PART(protocolo, '-', 2)::INTEGER AS ano,
    MAX(SPLIT_PART(protocolo, '-', 3)::INTEGER) AS ultimo_numero
  FROM solicitacoes
  WHERE protocolo IS NOT NULL
  GROUP BY
    "organizacaoId",
    SPLIT_PART(protocolo, '-', 1),
    SPLIT_PART(protocolo, '-', 2)::INTEGER
),

-- Identifica as solicitações antigas que ainda não têm protocolo.
pendentes AS (
  SELECT
    s.id,
    s."organizacaoId",
    s."createdAt",
    EXTRACT(YEAR FROM s."createdAt")::INTEGER AS ano,
    CASE LOWER(TRIM(sv.nome))
      WHEN 'castração' THEN 'CA'
      WHEN 'atendimento veterinário' THEN 'AV'
      WHEN 'outros procedimentos' THEN 'OS'
      WHEN 'vacinação' THEN 'VA'
    END AS prefixo
  FROM solicitacoes s
  INNER JOIN servicos sv ON sv.id = s."servicoId"
  WHERE s.protocolo IS NULL
),

-- Numera as solicitações respeitando organização, categoria e ano.
numeradas AS (
  SELECT
    p.id,
    p.prefixo,
    p.ano,
    COALESCE(pe.ultimo_numero, 0)
      + ROW_NUMBER() OVER (
          PARTITION BY p."organizacaoId", p.prefixo, p.ano
          ORDER BY p."createdAt", p.id
        ) AS numero
  FROM pendentes p
  LEFT JOIN protocolos_existentes pe
    ON pe."organizacaoId" = p."organizacaoId"
    AND pe.prefixo = p.prefixo
    AND pe.ano = p.ano
)

-- Atualiza os protocolos das solicitações antigas.
UPDATE solicitacoes s
SET protocolo =
  n.prefixo || '-' ||
  n.ano::TEXT || '-' ||
  LPAD(n.numero::TEXT, 6, '0')
FROM numeradas n
WHERE s.id = n.id;

-- Inicializa ou atualiza os contadores com os números utilizados.
INSERT INTO contadores_protocolos (
  id,
  "organizacaoId",
  prefixo,
  ano,
  "ultimoNumero",
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  s."organizacaoId",
  SPLIT_PART(s.protocolo, '-', 1),
  SPLIT_PART(s.protocolo, '-', 2)::INTEGER,
  MAX(SPLIT_PART(s.protocolo, '-', 3)::INTEGER),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM solicitacoes s
WHERE s.protocolo IS NOT NULL
GROUP BY
  s."organizacaoId",
  SPLIT_PART(s.protocolo, '-', 1),
  SPLIT_PART(s.protocolo, '-', 2)::INTEGER
ON CONFLICT ("organizacaoId", prefixo, ano)
DO UPDATE SET
  "ultimoNumero" = GREATEST(
    contadores_protocolos."ultimoNumero",
    EXCLUDED."ultimoNumero"
  ),
  "updatedAt" = CURRENT_TIMESTAMP;

COMMIT;
