# Development image - mount volume ./:/app, no need to rebuild on changes
FROM oven/bun:1.1.33-alpine
WORKDIR /app
COPY package.json bun.lockb ./
RUN ["bun", "install"]
COPY . .
EXPOSE 5173
CMD ["bun", "run", "dev", "--host"]
# Final image size: ~220MB
