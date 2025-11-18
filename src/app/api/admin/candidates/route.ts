
import { NextResponse } from 'next/server';

const mockCandidates = [
  { id: 'cand-001', name: 'John Doe', email: 'john.doe@email.com', role: 'React Developer', status: 'Interviewing', avatarUrl: 'https://i.pravatar.cc/150?u=cand001' },
  { id: 'cand-002', name: 'Emily White', email: 'emily.white@email.com', role: 'Project Manager', status: 'New', avatarUrl: 'https://i.pravatar.cc/150?u=cand002' },
  { id: 'cand-003', name: 'Michael Black', email: 'michael.black@email.com', role: 'UX/UI Designer', status: 'Hired', avatarUrl: 'https://i.pravatar.cc/150?u=cand003' },
  { id: 'cand-004', name: 'Sarah Green', email: 'sarah.green@email.com', role: 'Node.js Developer', status: 'Rejected', avatarUrl: 'https://i.pravatar.cc/150?u=cand004' },
  { id: 'cand-005', name: 'David Blue', email: 'david.blue@email.com', role: 'DevOps Engineer', status: 'New', avatarUrl: 'https://i.pravatar.cc/150?u=cand005' },
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return NextResponse.json(mockCandidates);
}
