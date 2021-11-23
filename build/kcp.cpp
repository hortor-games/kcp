//=====================================================================
//
// KCP - A Better ARQ Protocol Implementation
// skywind3000 (at) gmail.com, 2010-2011
//
// Features:
// + Average RTT reduce 30% - 40% vs traditional ARQ like tcp.
// + Maximum RTT reduce three times vs tcp.
// + Lightweight, distributed as a single source file.
//
//=====================================================================
#include "ikcp.h"

class Kcp;

class KcpOutputCallback
{
public:
  virtual int output(const void *buf, int len, Kcp *kcp, void *user) = 0;
  virtual ~KcpOutputCallback()
  {
  }
};

class KcpLogCallback
{
public:
  virtual int writelog(const char *log, Kcp *kcp, void *user) = 0;
  virtual ~KcpLogCallback()
  {
  }
};

struct KcpUser
{
public:
  Kcp *kcp;
  void *user;
};

class Kcp
{
public:
  Kcp(IUINT32 conv, void *user)
  {
    KcpUser *u = new KcpUser();
    u->kcp = this;
    u->user = user;
    this->user = u;
    this->output = 0;
    this->ikcp = ikcp_create(conv, u);
  }
  ~Kcp()
  {
    delete (this->user);
    ikcp_release(this->ikcp);
  }

  void setStream(int stream)
  {
    this->ikcp->stream = stream;
  }

  int getStream()
  {
    return this->ikcp->stream;
  }

  void setOutput(KcpOutputCallback *o)
  {
    if (this->output)
    {
      delete (this->output);
    }
    this->output = o;
    ikcp_setoutput(this->ikcp, [](const char *buf, int len, ikcpcb *kcp, void *user) -> int {
      KcpUser *u = (KcpUser *)user;
      return u->kcp->output->output((const void *)buf, len, u->kcp, u->user);
    });
  }

  void setWritelog(KcpLogCallback *l)
  {
    if (this->writelog)
    {
      delete (this->writelog);
    }
    this->writelog = l;
    this->ikcp->writelog = [](const char *log, ikcpcb *kcp, void *user) -> void {
      KcpUser *u = (KcpUser *)user;
      u->kcp->writelog->writelog(log, u->kcp, u->user);
    };
  }

  int recv(void *buffer, int len)
  {
    return ikcp_recv(this->ikcp, (char *)buffer, len);
  }

  int send(const void *buffer, int len)
  {
    return ikcp_send(this->ikcp, (const char *)buffer, len);
  }

  void update(IUINT32 current)
  {
    ikcp_update(this->ikcp, current);
  }

  IUINT32 check(IUINT32 current)
  {
    return ikcp_check(this->ikcp, current);
  }

  int input(const void *data, long size)
  {
    return ikcp_input(this->ikcp, (const char *)data, size);
  }

  void flush()
  {
    ikcp_flush(this->ikcp);
  }

  int peeksize()
  {
    return ikcp_peeksize(this->ikcp);
  }

  int setmtu(int mtu)
  {
    return ikcp_setmtu(this->ikcp, mtu);
  }

  int wndsize(int sndwnd, int rcvwnd)
  {
    return ikcp_wndsize(this->ikcp, sndwnd, rcvwnd);
  }

  int waitsnd()
  {
    return ikcp_waitsnd(this->ikcp);
  }

  int nodelay(int nodelay, int interval, int resend, int nc)
  {
    return ikcp_nodelay(this->ikcp, nodelay, interval, resend, nc);
  }

private:
  ikcpcb *ikcp;
  KcpOutputCallback *output;
  KcpLogCallback *writelog;
  KcpUser *user;
};
