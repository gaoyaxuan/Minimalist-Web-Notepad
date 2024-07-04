## Minimalist Web Notepad 

一个支持多端同步的简易Web Notepad

使用yjs和quilljs实现


## 运行教程
```
docker run -d -it --rm \
--name minimalist-web-notepad \
-ePERSISTENCE=false  \
-p  8080:3000/tcp  \
ghcr.io/gaoyaxuan/minimalist-web-notepad:latest 
```
或者下载[docker-compose.yml](docker-compose.yml)  docker-compose up -d 

```
## 
PERSISTENCE=true 表示服务端内存是否保存页面文档信息(重启服务之前)-即一个url下的所有用户全部关闭页面,下次打开时是否展示之前的信息
            false  所有用户关闭后再打开会是一个空的页面(只要有一个用户没有关闭也会相互同步)

