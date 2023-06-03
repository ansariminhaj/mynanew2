FROM python:3.9
RUN apt update && apt install -y libpq-dev gcc python3-dev python3-pip libsm6 libxext6 libxrender-dev postgresql postgresql-contrib
RUN apt-get install build-essential
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN /etc/init.d/postgresql start
WORKDIR /backend
COPY . .