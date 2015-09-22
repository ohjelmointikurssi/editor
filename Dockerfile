FROM node

RUN useradd -g users user
RUN npm install -g grunt-cli && apt-get update && apt-get install -y ruby --no-install-recommends && rm -rf /var/lib/apt/lists/* && gem install sass

ADD . /app

RUN chown -R user:users /app
WORKDIR app

USER user

RUN npm install -d

EXPOSE 8080

CMD ["/bin/bash"]
