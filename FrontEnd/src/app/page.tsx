import MainLanding from '@/components/LandingPage/MainLanding';
import AppLoader from '@/components/LandingPage/Apploader';

export default function Home() {
  return (
    <AppLoader>
      <MainLanding />
    </AppLoader>
  );
}
