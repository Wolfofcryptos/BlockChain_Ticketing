FROM node:8.11.3-stretch

# set work directory
WORKDIR /opt/app

# add os dependencies
RUN sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
	apt-get update && \
	apt-get install -y \
	  nasm \
	  make \
	  gcc-multilib \
	  bash \
	  && \
	rm -rf /var/lib/apt/lists/*

# add project files
COPY . .

# install node packages
RUN npm install --quiet --loglevel=error

EXPOSE 8000

# entry point for docker
CMD ["npm", "run", "start"]
