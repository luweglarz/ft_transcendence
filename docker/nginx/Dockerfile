FROM debian:buster as developement

EXPOSE 443

RUN apt-get -y update

RUN apt-get install -y nginx

COPY conf/website.conf /etc/nginx/sites-available/website.conf
RUN ln -s /etc/nginx/sites-available/website.conf /etc/nginx/sites-enabled/ \
&& rm -rf /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default 

RUN apt-get install -y openssl \
&&      openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -subj '/CN=lweglarz' \ 
        -keyout /etc/ssl/private/mywebserv.key -out /etc/ssl/certs/mywebserv.crt

COPY tools/nginx_setup.sh /

CMD ["bash", "nginx_setup.sh"]