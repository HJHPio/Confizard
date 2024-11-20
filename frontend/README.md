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
