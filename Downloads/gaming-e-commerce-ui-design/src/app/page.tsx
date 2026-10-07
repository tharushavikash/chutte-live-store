import TopUpWidget from "@/components/site/TopUpWidget";
import Faq from "@/components/site/Faq";
import { orders, packages, paymentMethods, memberships } from "@/db/schema";
import { db } from "@/db";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";

export default async function Home() {
  const rawPackages = await db.select().from(packages);
  const allPackages = rawPackages.map(pkg => ({
    ...pkg,
    price: Number(pkg.price),
  }));

  const rawMemberships = await db.select().from(memberships);
  const allMemberships = rawMemberships.map(m => ({
    ...m,
    price: Number(m.price),
  }));

  const allPaymentMethods = await db.select().from(paymentMethods);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500 selection:text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-12">
        <Hero delivered={0} />
        
        <section id="store" className="scroll-mt-20">
          <TopUpWidget 
            packages={allPackages} 
            memberships={allMemberships}
            paymentMethods={allPaymentMethods} 
          />
        </section>
        
        <Faq />
      </main>
    </div>
  );
}