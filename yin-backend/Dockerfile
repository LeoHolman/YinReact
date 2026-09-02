FROM node:20-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip ffmpeg libsndfile1 \
    && python3 -m pip install --no-cache-dir --break-system-packages librosa soundfile numpy \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV MONGO_URL=mongodb://host.docker.internal:27017/yin
ENV PYTHON_EXECUTABLE=python3
EXPOSE 8000

CMD ["npm", "run", "start"]
