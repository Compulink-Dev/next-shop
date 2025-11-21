import dbConnect from './dbConnect';
import ProductModel from './models/ProductModel';
import BannerModel from './models/BannerModel';

// IT Company Products
const products = [
  // Laptops & Computers
  {
    part: "LAP-001",
    name: "Dell Latitude 7430 Business Laptop",
    slug: "dell-latitude-7430-business-laptop",
    category: "Laptops & Computers",
    image: "/images/dell-laptop.png",
    price: 1299.99,
    brand: "Dell",
    rating: 4.8,
    numReviews: 156,
    countInStock: 15,
    description: "14-inch enterprise laptop with Intel Core i7-1265U, 16GB RAM, 512GB NVMe SSD. Built for business professionals with military-grade durability and enterprise-level security features.",
    isFeatured: true,
  },
  {
    part: "LAP-002",
    name: "HP EliteBook 840 G9 Workstation",
    slug: "hp-elitebook-840-g9-workstation",
    category: "Laptops & Computers",
    image: "/images/ai3.png",
    price: 1499.99,
    brand: "HP",
    rating: 4.7,
    numReviews: 134,
    countInStock: 12,
    description: "Premium business laptop featuring 12th Gen Intel Core i7, 32GB DDR5 RAM, 1TB SSD. Perfect for developers and IT professionals requiring high performance.",
  },
  {
    part: "DES-001",
    name: "Dell OptiPlex 7090 Desktop Tower",
    slug: "dell-optiplex-7090-desktop",
    category: "Laptops & Computers",
    image: "/images/optiplex.png",
    price: 899.99,
    brand: "Dell",
    rating: 4.6,
    numReviews: 89,
    countInStock: 25,
    description: "Reliable desktop computer with Intel Core i5-11500, 16GB RAM, 512GB SSD, Windows 11 Pro. Ideal for office deployments and business use.",
  },
  {
    part: "WKS-001",
    name: "HP Z2 G9 Tower Workstation",
    slug: "hp-z2-g9-tower-workstation",
    category: "Laptops & Computers",
    image: "/images/hp-z2.png",
    price: 2199.99,
    brand: "HP",
    rating: 4.9,
    numReviews: 67,
    countInStock: 8,
    description: "Professional workstation with Intel Xeon processor, 64GB ECC RAM, NVIDIA RTX A2000 graphics. Designed for CAD, 3D modeling, and video editing.",
    isFeatured: true,
  },
  {
    part: "MAC-001",
    name: "Apple MacBook Pro 14-inch M3 Pro",
    slug: "macbook-pro-14-m3-pro",
    category: "Laptops & Computers",
    image: "/images/apple.png",
    price: 1999.99,
    brand: "Apple",
    rating: 4.9,
    numReviews: 234,
    countInStock: 18,
    description: "Powerful laptop with M3 Pro chip, 18GB unified memory, 512GB SSD. Perfect for developers, designers, and creative professionals.",
  },

  // Servers & Storage
  {
    part: "SRV-001",
    name: "Dell PowerEdge T150 Server",
    slug: "dell-poweredge-t150-server",
    category: "Servers & Storage",
    image: "/images/poweredge.png",
    price: 1599.99,
    brand: "Dell",
    rating: 4.7,
    numReviews: 45,
    countInStock: 10,
    description: "Entry-level tower server with Intel Xeon E-2314, 16GB RAM, 1TB HDD. Perfect for small business file sharing and applications.",
  },
  {
    part: "SRV-002",
    name: "HPE ProLiant DL380 Gen10 Plus",
    slug: "hpe-proliant-dl380-gen10-plus",
    category: "Servers & Storage",
    image: "/images/unifi.png",
    price: 3499.99,
    brand: "HPE",
    rating: 4.8,
    numReviews: 78,
    countInStock: 6,
    description: "2U rack server with dual Intel Xeon Gold processors, 128GB RAM, hot-plug drives. Enterprise-grade reliability for data centers.",
    isFeatured: true,
  },
  {
    part: "NAS-001",
    name: "Synology DS923+ NAS Storage",
    slug: "synology-ds923-nas-storage",
    category: "Servers & Storage",
    image: "/images/synology.png",
    price: 599.99,
    brand: "Synology",
    rating: 4.8,
    numReviews: 167,
    countInStock: 22,
    description: "4-bay NAS with AMD Ryzen processor, 4GB RAM (expandable to 32GB). Ideal for centralized data storage and backup solutions.",
  },
  {
    part: "SAN-001",
    name: "Dell EMC Unity XT 380 Storage Array",
    slug: "dell-emc-unity-xt-380",
    category: "Servers & Storage",
    image: "/images/dell-emc.png",
    price: 8999.99,
    brand: "Dell EMC",
    rating: 4.9,
    numReviews: 34,
    countInStock: 3,
    description: "Unified storage system with all-flash performance, dual controllers, 25TB usable capacity. Enterprise SAN solution for mission-critical applications.",
  },
  {
    part: "BKP-001",
    name: "Veeam Backup & Replication License",
    slug: "veeam-backup-replication-license",
    category: "Servers & Storage",
    image: "/images/veeam.png",
    price: 449.99,
    brand: "Veeam",
    rating: 4.7,
    numReviews: 123,
    countInStock: 50,
    description: "Enterprise backup software license for 10 VMs. Industry-leading data protection and disaster recovery solution.",
  },

  // Networking Equipment
  {
    part: "NET-001",
    name: "Cisco Catalyst 1000-24T Switch",
    slug: "cisco-catalyst-1000-24t-switch",
    category: "Networking",
    image: "/images/cisco.png",
    price: 899.99,
    brand: "Cisco",
    rating: 4.6,
    numReviews: 89,
    countInStock: 18,
    description: "24-port Gigabit managed switch with 4x 1G SFP uplinks. Enterprise-grade switching for small to medium businesses.",
  },
  {
    part: "NET-002",
    name: "Ubiquiti UniFi Dream Machine Pro",
    slug: "ubiquiti-unifi-dream-machine-pro",
    category: "Networking",
    image: "/images/unifi.png",
    price: 379.99,
    brand: "Ubiquiti",
    rating: 4.7,
    numReviews: 234,
    countInStock: 35,
    description: "All-in-one network appliance with routing, switching, security gateway, and NVR. 8-port PoE+ switch included for unified network management.",
    isFeatured: true,
  },
  {
    part: "NET-003",
    name: "Fortinet FortiGate 60F Firewall",
    slug: "fortinet-fortigate-60f-firewall",
    category: "Networking",
    image: "/images/fortigate.png",
    price: 1299.99,
    brand: "Fortinet",
    rating: 4.8,
    numReviews: 156,
    countInStock: 14,
    description: "Next-generation firewall with SD-WAN, 10Gbps throughput, advanced threat protection. Comprehensive security for branch offices.",
  },
  {
    part: "NET-004",
    name: "Aruba Instant On AP22 Access Point",
    slug: "aruba-instant-on-ap22",
    category: "Networking",
    image: "/images/aruba.png",
    price: 199.99,
    brand: "Aruba",
    rating: 4.5,
    numReviews: 187,
    countInStock: 42,
    description: "Wi-Fi 6 access point with dual 2x2 MU-MIMO, cloud management. Easy deployment for small business wireless networks.",
  },
  {
    part: "NET-005",
    name: "Cisco Meraki MX68 Security Appliance",
    slug: "cisco-meraki-mx68-security-appliance",
    category: "Networking",
    image: "/images/cisco2.png",
    price: 1599.99,
    brand: "Cisco Meraki",
    rating: 4.9,
    numReviews: 98,
    countInStock: 12,
    description: "Cloud-managed security and SD-WAN appliance with 450 Mbps firewall throughput. Zero-touch deployment with centralized management.",
  },

  // Software & Licenses
  {
    part: "SW-001",
    name: "Microsoft Windows Server 2022 Standard",
    slug: "windows-server-2022-standard",
    category: "Software & Licenses",
    image: "/images/windows-server-2022.png",
    price: 749.99,
    brand: "Microsoft",
    rating: 4.6,
    numReviews: 145,
    countInStock: 100,
    description: "Latest Windows Server operating system with 16-core license. Enhanced security and hybrid cloud capabilities for modern enterprises.",
  },
  {
    part: "SW-002",
    name: "VMware vSphere 8 Standard License",
    slug: "vmware-vsphere-8-standard",
    category: "Software & Licenses",
    image: "/images/vmware.png",
    price: 995.99,
    brand: "VMware",
    rating: 4.8,
    numReviews: 234,
    countInStock: 75,
    description: "Industry-leading virtualization platform for building cloud infrastructure. Includes vCenter Server Standard for centralized management.",
    isFeatured: true,
  },
  {
    part: "SW-003",
    name: "Microsoft 365 Business Premium (Annual)",
    slug: "microsoft-365-business-premium",
    category: "Software & Licenses",
    image: "/images/microsoft-365.png",
    price: 329.99,
    brand: "Microsoft",
    rating: 4.7,
    numReviews: 456,
    countInStock: 200,
    description: "Complete productivity suite with Office apps, Teams, Exchange, OneDrive, and advanced security. Per user annual subscription.",
  },
  {
    part: "SW-005",
    name: "Adobe Creative Cloud for Teams",
    slug: "adobe-creative-cloud-teams",
    category: "Software & Licenses",
    image: "/images/adobe.png",
    price: 89.99,
    brand: "Adobe",
    rating: 4.8,
    numReviews: 312,
    countInStock: 100,
    description: "Complete creative suite including Photoshop, Illustrator, Premiere Pro, and more. Per user monthly subscription with admin console.",
  },
];

// IT-Focused Banners
const banners = [
  {
    name: "Enterprise IT Solutions",
    slug: "enterprise-it-solutions",
    image: "/images/banner-1.jpg",
  },
  {
    name: "Cloud Infrastructure Deals",
    slug: "cloud-infrastructure-deals",
    image: "/images/banner-networks.jpg",
  },
  {
    name: "Business Laptop Specials",
    slug: "business-laptop-specials",
    image: "/images/banner-3.webp",
  },
  {
    name: "Networking Equipment Sale",
    slug: "networking-equipment-sale",
    image: "/images/banner-newtworks.jpg",
  },
];

async function seed() {
  try {
    console.log('🌱 Connecting to database...');
    await dbConnect();
    
    console.log('🗑️  Clearing existing data...');
    await ProductModel.deleteMany({});
    await BannerModel.deleteMany({});
    
    console.log('📦 Seeding IT products...');
    const createdProducts = await ProductModel.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);
    
    console.log('🎨 Seeding banners...');
    const createdBanners = await BannerModel.insertMany(banners);
    console.log(`✅ Created ${createdBanners.length} banners`);
    
    console.log('✨ Seeding completed successfully!');
    console.log('   Categories: Laptops & Computers, Servers & Storage, Networking, Software & Licenses');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed();
}

export default seed;
