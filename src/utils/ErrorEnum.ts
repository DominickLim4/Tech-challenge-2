export enum ErrorCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export enum ErrorMessage {
  POST_NOT_FOUND = "Post nao encontrado",
  INVALID_ID = "ID do post invalido",
  TITLE_REQUIRED = "Titulo do post e obrigatorio",
  CONTENT_REQUIRED = "Conteudo do post e obrigatorio",
  AUTHOR_REQUIRED = "Autor do post e obrigatorio",
  TITLE_MIN_LENGTH = "Titulo deve ter pelo menos 3 caracteres",
  CONTENT_MIN_LENGTH = "Conteudo deve ter pelo menos 10 caracteres",
  QUERY_REQUIRED = "Query de busca e obrigatoria",
  QUERY_MIN_LENGTH = "Query deve ter pelo menos 2 caracteres",
  UPDATE_FIELD_REQUIRED = "Pelo menos um campo deve ser fornecido",
  INTERNAL_SERVER_ERROR = "Erro interno do servidor",
}
