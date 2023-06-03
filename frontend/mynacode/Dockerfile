FROM node:16.16
WORKDIR /frontend
COPY . .
RUN npm -g install create-react-app
RUN npm install --legacy-peer-deps
RUN npm run build