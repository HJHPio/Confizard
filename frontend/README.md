# Development
```sh
docker compose up --build
```

# Test deployment
```sh
docker build -t confizard-min-0 -f Dockerfile-nginx-slim .
```

```sh
docker run -it --name confizard-0 -p 80:80 -v ./public/steps-data:/etc/nginx/html/zero/steps-data confizard-min-0 
```

## Test latest version

```sh
docker run -it --name confizard-app -p 80:80 -v ./public/steps-data:/etc/nginx/html/zero/steps-data hjhp/confizard:latest
```

# Image versions
- development/debug (image size: 335MB): hjhp/confizard:0.0.0-dev
```sh
docker build -t hjhp/confizard:0.0.0-dev -f Dockerfile .
docker push hjhp/confizard:0.0.0-dev
```
- bun as a server (image size: 116MB): hjhp/confizard:0.0.0-bun-1.1.33-alpine
```sh
docker build -t hjhp/confizard:0.0.0-bun-1.1.33-alpine -f Dockerfile-bun .
docker push hjhp/confizard:0.0.0-bun-1.1.33-alpine
```
- nginx (image size: 192MB): hjhp/confizard:0.0.0-nginx-1.27.2-bookworm
```sh
docker build -t hjhp/confizard:0.0.0-nginx-1.27.2-bookworm -f Dockerfile-nginx .
docker push hjhp/confizard:0.0.0-nginx-1.27.2-bookworm
```
- nginx slim (image size: 17.8MB): hjhp/confizard:0.0.0-nginx-mainline-alpine3.20-slim
```sh
docker build -t hjhp/confizard:0.0.0-nginx-mainline-alpine3.20-slim -f Dockerfile-nginx-slim .
docker tag hjhp/confizard:0.0.0-nginx-mainline-alpine3.20-slim hjhp/confizard:latest
docker tag hjhp/confizard:0.0.0-nginx-mainline-alpine3.20-slim hjhp/confizard:0.0.0-prod
docker tag hjhp/confizard:0.0.0-nginx-mainline-alpine3.20-slim hjhp/confizard:0.0.0-test
docker push hjhp/confizard:0.0.0-nginx-mainline-alpine3.20-slim
```