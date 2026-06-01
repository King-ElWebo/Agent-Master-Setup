import { CustomerService } from "./services";

export const servicesFixtures: CustomerService[] = [
  {
    id: "svc-fixture-1",
    title: "Fullstack Custom Development",
    description: "End-to-end web application design, planning, deployment, and ongoing server support.",
    imageUrl: "/uploads/fullstack-development.png",
    price: 150.0,
    category: "Engineering",
    active: true,
  },
  {
    id: "svc-fixture-2",
    title: "Database Performance Tuning",
    description: "Thorough audit of indexes, query execution plans, memory buffers, and connection pooling.",
    imageUrl: "/uploads/db-tuning.png",
    price: 250.0,
    category: "Engineering",
    active: true,
  },
  {
    id: "svc-fixture-3",
    title: "System Architecture Advisory",
    description: "Consultation and blueprints for scalable monoliths, zero-database architectures, and APIs.",
    imageUrl: "/uploads/sys-arch.png",
    price: undefined,
    category: "Consulting",
    active: true,
  },
  {
    id: "svc-fixture-4",
    title: "Cloud Infrastructure Setup",
    description: "Deploying high-availability infrastructure using container orchestration and global CDNs.",
    imageUrl: "/uploads/cloud-setup.png",
    price: 350.0,
    category: "Infrastructure",
    active: false,
  },
];
