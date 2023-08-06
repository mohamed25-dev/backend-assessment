postgres:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:15.3-alpine3.18

createdb:
	docker exec -it postgres createdb --username=root --owner=root bikes_data

dropdb:
	docker exec -it postgres dropdb bikes_data

migrateup:
	npx prisma migrate dev --name init