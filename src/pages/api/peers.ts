import type { APIRoute } from 'astro';

// In-memory peer pool (in production, use a proper database)
const availablePeers = new Set<string>();

export const GET: APIRoute = async () => {
  // Get a random peer from the pool
  const peers = Array.from(availablePeers);
  const randomPeer = peers[Math.floor(Math.random() * peers.length)];
  
  if (randomPeer) {
    availablePeers.delete(randomPeer);
  }
  
  return new Response(JSON.stringify({ peerId: randomPeer }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  const { peerId, action } = await request.json();
  
  if (action === 'add') {
    availablePeers.add(peerId);
  } else if (action === 'remove') {
    availablePeers.delete(peerId);
  }
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};