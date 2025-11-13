import { ReactElement, useEffect, useState } from 'react';
import { handlePaymentSuccess } from './features/payment/utils/paymentSuccess';
import { GameContainer } from './features/game/components/GameContainer';
import { Footer } from './shared/components/layout/Footer';
import { useTheme } from './features/themes/hooks/useTheme';
import confetti from 'canvas-confetti';

/**
 * Root App Component
 * Main game container with payment success handling and theme application
 */
function App(): ReactElement {
  const [premiumActivated, setPremiumActivated] = useState(false);
  const { currentTheme } = useTheme();

  // Check for payment success on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('session') === 'success') {
      const activated = handlePaymentSuccess(params);
      if (activated) {
        setPremiumActivated(true);
        // Show success confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Clear URL params after handling
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // Apply theme CSS variables on mount and theme change
  useEffect(() => {
    const root = document.documentElement;
    const { colors } = currentTheme;

    root.style.setProperty('--color-bg', colors.bg);
    root.style.setProperty('--color-card', colors.card);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-text', colors.text);
  }, [currentTheme]);

  return (
    <>
      {/* Premium activation banner */}
      {premiumActivated && (
        <div className="fixed top-4 left-4 right-4 z-50 p-4 bg-tealA/90 border border-tealA rounded-lg shadow-lift max-w-md mx-auto">
          <p className="text-white font-bold text-sm text-center">
            Premium Activated!
          </p>
        </div>
      )}

      {/* Main game */}
      <GameContainer />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
