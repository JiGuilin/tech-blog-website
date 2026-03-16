#!/usr/bin/env python3
import os
from aiohttp import web
from datetime import datetime

ROOT='/home/admin/openclaw/workspace/website'
MIME={'.html':'text/html','.css':'text/css','.js':'application/javascript','.md':'text/markdown','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png'}
async def h(r):
    p=r.match_info.get('path','') or 'index.html'
    f=os.path.join(ROOT,p)
    if not os.path.abspath(f).startswith(os.path.abspath(ROOT)):return web.Response(status=403,text='Forbidden')
    if not os.path.exists(f):return web.Response(status=404,text='Not Found')
    if os.path.isdir(f):f=os.path.join(f,'index.html')
    try:c=open(f,'rb').read()
    except:return web.Response(status=500,text='Error')
    m=MIME.get(os.path.splitext(f)[1],'text/plain')
    t=datetime.utcfromtimestamp(os.path.getmtime(f)).strftime('%a, %d %b %Y %H:%M:%S GMT')
    return web.Response(body=c,content_type=m,headers={'Cache-Control':'no-store,no-cache,must-revalidate','Pragma':'no-cache','Expires':'0','Last-Modified':t})
app=web.Application();app.router.add_get('/{path:.*}',h)
if __name__=='__main__':
    print(f'🚀 http://0.0.0.0:8080');web.run_app(app,host='0.0.0.0',port=8080,print=None)
