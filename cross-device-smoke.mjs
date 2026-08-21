const base = process.env.PROLINE_URL || 'https://prodorder-uadecxvr.manus.space';
async function call(path, input, cookie) {
  const isQuery = path === 'board.list';
  const url = isQuery ? `${base}/api/trpc/${path}?input=${encodeURIComponent(JSON.stringify({ json: input }))}` : `${base}/api/trpc/${path}`;
  const response = await fetch(url, { method: isQuery ? 'GET' : 'POST', headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, ...(isQuery ? {} : { body: JSON.stringify({ json: input }) }) });
  const setCookie = response.headers.get('set-cookie') || '';
  const text = await response.text();
  let data; try { data = JSON.parse(text); } catch { throw new Error(`${path} returned ${response.status}: ${text.slice(0, 300)}`); }
  if (!response.ok || data.error) throw new Error(`${path} failed: ${JSON.stringify(data).slice(0, 500)}`);
  return { data: data.result?.data?.json ?? data.result?.data, cookie: setCookie.split(';')[0] };
}
const dispatcher = await call('board.login', { email: 'dispatcher@proline', code: '010203' });
const production = await call('board.login', { email: 'production@proline', code: '010203' });
const created = await call('board.create', { title: `Smoke ${Date.now()}`, description: 'Cross-device verification', priority: 'normal' }, dispatcher.cookie);
const createdId = Number(created.data?.id);
if (!createdId) throw new Error(`Create did not return an order id: ${JSON.stringify(created.data)}`);
await call('board.requestMove', { orderId: createdId, toColumn: 'production' }, dispatcher.cookie);
const dispatcherBoard = await call('board.list', undefined, dispatcher.cookie);
const productionBoard = await call('board.list', undefined, production.cookie);
const productionOrder = productionBoard.data.orders.find((order) => Number(order.id) === createdId);
const productionNotice = productionBoard.data.notifications.find((notice) => Number(notice.orderId) === createdId);
if (!productionOrder || productionOrder.pendingTo !== 'production' || !productionNotice || productionNotice.status !== 'pending') throw new Error('Production session did not receive shared order and pending approval');
console.log(JSON.stringify({ dispatcherOrders: dispatcherBoard.data.orders.length, productionOrders: productionBoard.data.orders.length, sharedCounts: dispatcherBoard.data.orders.length === productionBoard.data.orders.length, productionReceivedOrder: true, productionReceivedApproval: true }));
