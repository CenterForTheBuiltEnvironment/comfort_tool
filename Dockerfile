FROM ubuntu:14.04

MAINTAINER Tyler Hoyt <thoyt@berkeley.edu>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get install -y python-setuptools gunicorn
RUN easy_install pip

ADD requirements.txt /src/requirements.txt
RUN cd /src; pip install -r requirements.txt

ADD . /src

WORKDIR /src

EXPOSE 5000

CMD ["/usr/bin/gunicorn", "--config", "/src/gunicorn_config.py", "comfort:app"]
