const base = process.env.PROLINE_URL || 'https://3000-ikw7krtnpqczravivue9e-d56a3847.us3.manus.computer';
async function call(path, input, cookie, method = 'POST') { const isQuery = method === 'GET'; const url = isQuery ? `${base}/api/trpc/${path}?input=${encodeURIComponent(JSON.stringify({ json: input }))}` : `${base}/api/trpc/${path}`; const response = await fetch(url, { method, headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, ...(isQuery ? {} : { body: JSON.stringify({ json: input }) }) }); const setCookie = response.headers.get('set-cookie') || ''; const text = await response.text(); let data; try { data = JSON.parse(text); } catch { throw new Error(`${path} returned ${response.status}: ${text.slice(0, 300)}`); } if (!response.ok || data.error) throw new Error(`${path} failed: ${JSON.stringify(data).slice(0, 500)}`); return { data: data.result?.data?.json ?? data.result?.data, cookie: setCookie.split(';')[0] }; }
const dispatcher = await call('board.login', { email: 'dispatcher@proline', code: '010203' });
const production = await call('board.login', { email: 'production@proline', code: '010203' });
const restoredSession = await call('board.session', undefined, dispatcher.cookie, 'GET');
if (restoredSession.data?.email !== 'dispatcher@proline') throw new Error('Reload session was not restored');
const created = await call('board.create', { title: `Smoke ${Date.now()}`, description: 'Cross-device verification', priority: 'normal' }, dispatcher.cookie);
const createdId = Number(created.data?.id); if (!createdId) throw new Error(`Create did not return an order id: ${JSON.stringify(created.data)}`);
await call('board.requestMove', { orderId: createdId, toColumn: 'production' }, dispatcher.cookie);
const productionBoard = await call('board.list', undefined, production.cookie, 'GET');
const productionOrder = productionBoard.data.orders.find((order) => Number(order.id) === createdId);
const productionNotice = productionBoard.data.notifications.find((notice) => Number(notice.orderId) === createdId);
if (!productionOrder || productionOrder.pendingTo !== 'production' || !productionNotice || productionNotice.status !== 'pending') throw new Error('Production did not receive shared order and pending approval');
console.log(JSON.stringify({ reloadSessionRestored: true, productionReceivedOrder: true, productionReceivedApproval: true, pendingStatus: productionOrder.pendingTo }));
