import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Collection from '@/components/Collection';
import Marquee from '@/components/Marquee';
import Timeline from '@/components/Timeline';
import Reviews from '@/components/Reviews';
import Footer from '@/components/Footer';
import VenueSection from '@/components/VenueSection';

export default function Home() {
  return (
    <main>
      {/* Announcement Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg,#04060e,#080d18,#04060e)',
          borderBottom: '1px solid rgba(205,127,50,.4)',
          color: '#eef0f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px 24px',
          flexWrap: 'wrap',
          padding: '10px 20px',
          fontSize: 12.5,
          letterSpacing: '.5px',
          lineHeight: 1.4,
          boxShadow: '0 1px 20px rgba(205,127,50,0.12)',
        }}
      >
        <span style={{ whiteSpace: 'nowrap' }}>✦ <strong style={{ color: '#e8a85a' }}>217 couples</strong> chose a template this month</span>
        <span style={{ opacity: .4 }}>|</span>
        <span style={{ whiteSpace: 'nowrap' }}><strong style={{ color: '#e8a85a' }}>4.9★</strong> on Google</span>
        <span style={{ opacity: .4 }}>|</span>
        <span style={{ whiteSpace: 'nowrap' }}>Your invitations will go live <strong style={{ color: '#e8a85a' }}>instantly</strong></span>
      </div>

      <Navbar />
      <Hero />
      <Collection />
      <Marquee />
      <Timeline />
      <VenueSection />
      <Reviews />
      <Footer />
    </main>
  );
}
