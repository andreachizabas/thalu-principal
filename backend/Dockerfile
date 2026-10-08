FROM golang:1.26-alpine AS build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/thalu-api ./cmd/api

FROM alpine:3.22

RUN adduser -D -H thalu
USER thalu
WORKDIR /app

COPY --from=build /bin/thalu-api /bin/thalu-api

EXPOSE 8080
ENTRYPOINT ["/bin/thalu-api"]
