FROM node:20-alpine as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm install expo
RUN npx expo install react-native-web react-dom @expo/metro-runtime

EXPOSE 8081

CMD ["npx", "expo", "start"]