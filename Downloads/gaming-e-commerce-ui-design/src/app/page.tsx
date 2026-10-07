import TopUpWidget from "@/components/site/TopUpWidget";
import Faq from "@/components/site/Faq";
import { orders, packages, paymentMethods, memberships } from "@/db/schema";
import { db } from "@/db";
import { desc } from "drizzle-orm";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import HeroSlider from "@/components/site/HeroSlider";
import GameGrid from "@/components/site/GameGrid";
import SpecialOffers from "@/components/site/SpecialOffers";

export default async function Home() {
  // Fetch active packages and memberships for the store
  const allPackages = await db.select().from(packages);
  const allMemberships = await db.select().from(memberships);
  const allPaymentMethods = await db.select().from(paymentMethods);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500 selection:text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 space-y-12">
        <HeroSlider />
        
        {/* Main Top-Up and Store Section */}
        <section id="store" className="scroll-mt-20">
          <TopUpWidget 
            packages={allPackages} 
            memberships={allMemberships}
            paymentMethods={allPaymentMethods} 
          />
        </section>

        <SpecialOffers />
        
        <GameGrid />
        
        <Faq />
      </main>

      <Footer />
    </div>
  );
}