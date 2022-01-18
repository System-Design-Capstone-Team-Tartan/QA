FROM postgres
ENV POSTGRES_USER admin POSTGRES_PASSWORD tartar POSTGRES_DB tmp
COPY postgres/schema.sql /docker-entrypoint-initdb.d/
COPY CSV/answers_photos.csv /docker-entrypoint-initdb.d/
COPY CSV/answers.csv /docker-entrypoint-initdb.d/
COPY CSV/questions.csv /docker-entrypoint-initdb.d/
# Are these ^^ being copied to the correct directory?
EXPOSE 5432