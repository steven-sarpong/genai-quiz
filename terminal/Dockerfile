FROM alpine:3.20

RUN apk add --no-cache bash curl ca-certificates openssl tar \
    && curl -sLO "https://dl.k8s.io/release/$(curl -sL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl \
    && rm kubectl \
    && curl -sLo /usr/local/bin/ttyd "https://github.com/tsl0922/ttyd/releases/download/1.7.7/ttyd.x86_64" \
    && chmod +x /usr/local/bin/ttyd

ENV KUBECONFIG=/root/.kube/config
RUN mkdir -p /root/.kube
COPY cka-kubeconfig-internal.yaml /root/.kube/config

WORKDIR /root
EXPOSE 7681
CMD ["ttyd", "-W", "bash"]
