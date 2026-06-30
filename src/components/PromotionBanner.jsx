import React, { useState, useEffect } from 'react';

export default function PromotionBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const promotions = [
    {
      id: 1,
      title: "🐼 PANDA BONUS",
      subtitle: "Play Safe, Win Big!",
      description: "Get 200% welcome bonus on your first deposit",
      color: "#2d8a4e",
      emoji: "🐼",
      image: "🌸",
      bgGradient: "linear-gradient(135deg, #1a3a2a, #2d8a4e, #4caf50)",
      animal: "🐼 Panda",
      promoCode: "PANDA200"
    },
    {
      id: 2,
      title: "🐯 TIGER CHALLENGE",
      subtitle: "Unleash the Tiger Within!",
      description: "Win up to 10,000 ETB in daily tournaments",
      color: "#ff6b00",
      emoji: "🐯",
      image: "🔥",
      bgGradient: "linear-gradient(135deg, #4a1a00, #ff6b00, #ff9500)",
      animal: "🐯 Tiger",
      promoCode: "TIGER1000"
    },
    {
      id: 3,
      title: "🦒 GIRAFFE REWARDS",
      subtitle: "Reach New Heights!",
      description: "Climb the VIP ladder for exclusive rewards",
      color: "#d4a017",
      emoji: "🦒",
      image: "⭐",
      bgGradient: "linear-gradient(135deg, #3d2b00, #d4a017, #ffd700)",
      animal: "🦒 Giraffe",
      promoCode: "GIRAFFE50"
    },
    {
      id: 4,
      title: "💃 WINNER'S SMILE",
      subtitle: "Smile, You Just Won! 🎉",
      description: "100% cashback on your first 5 bets this week!",
      color: "#e91e8c",
      emoji: "💃",
      image: "👩",
      bgGradient: "linear-gradient(135deg, #4a0a2a, #e91e8c, #ff6bb5)",
      animal: "💃 Winner",
      promoCode: "SMILE100"
    }
  ];

  const currentPromo = promotions[currentSlide];

  const styles = {
    container: {
      margin: '30px 0 10px 0',
      borderRadius: '20px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
      animation: 'slideUp 0.8s ease-out',
    },
    banner: {
      background: currentPromo.bgGradient,
      padding: '30px 25px',
      position: 'relative',
      minHeight: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden',
    },
    content: {
      zIndex: 2,
      flex: 1,
    },
    animalEmoji: {
      fontSize: '4em',
      animation: 'float 3s ease-in-out infinite',
      display: 'block',
    },
    title: {
      fontSize: '1.8em',
      fontWeight: '900',
      color: '#fff',
      textShadow: '0 2px 20px rgba(0,0,0,0.3)',
      marginBottom: '5px',
      letterSpacing: '1px',
    },
    subtitle: {
      fontSize: '1.2em',
      color: 'rgba(255,255,255,0.9)',
      fontWeight: '600',
      marginBottom: '8px',
    },
    description: {
      fontSize: '0.95em',
      color: 'rgba(255,255,255,0.8)',
      marginBottom: '12px',
    },
    promoCode: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.2)',
      padding: '8px 20px',
      borderRadius: '30px',
      fontSize: '0.9em',
      fontWeight: '700',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.3)',
      backdropFilter: 'blur(10px)',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    animalImage: {
      fontSize: '5em',
      animation: 'float 2.5s ease-in-out infinite',
      marginRight: '20px',
      textAlign: 'center',
      minWidth: '100px',
    },
    animalName: {
      fontSize: '0.8em',
      color: 'rgba(255,255,255,0.6)',
      marginTop: '5px',
      display: 'block',
    },
    dotsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      padding: '15px',
      background: 'rgba(0,0,0,0.3)',
    },
    dot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
      background: '#00BFFF',
      transform: 'scale(1.3)',
      boxShadow: '0 0 20px rgba(0,191,255,0.5)',
    },
    particles: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
    },
    particle: (delay, size, left) => ({
      position: 'absolute',
      width: size,
      height: size,
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '50%',
      top: '-20px',
      left: left,
      animation: `fall ${6 + Math.random() * 4}s linear infinite`,
      animationDelay: `${delay}s`,
    }),
    smilies: {
      position: 'absolute',
      top: '50%',
      right: '10%',
      transform: 'translateY(-50%)',
      fontSize: '3em',
      animation: 'spin 8s linear infinite',
      opacity: 0.3,
    },
    claimButton: {
      background: 'rgba(255,255,255,0.2)',
      border: '1px solid rgba(255,255,255,0.3)',
      padding: '10px 25px',
      borderRadius: '30px',
      color: '#fff',
      fontSize: '0.9em',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s',
      backdropFilter: 'blur(10px)',
      marginTop: '10px',
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: '1.5em',
      fontWeight: '700',
      marginTop: '30px',
      marginBottom: '10px',
      background: 'linear-gradient(135deg, #00BFFF, #7B2FBE)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    sectionSubtitle: {
      textAlign: 'center',
      opacity: 0.5,
      fontSize: '0.9em',
      marginBottom: '20px',
    }
  };

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(200px) rotate(720deg); opacity: 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .promo-banner:hover {
          transform: scale(1.01);
          transition: transform 0.3s ease;
        }
      `}</style>

      {/* Section Title */}
      <h2 style={styles.sectionTitle}>🎯 Exclusive Promotions</h2>
      <p style={styles.sectionSubtitle}>Scroll down to see our special offers!</p>

      <div style={styles.container} className="promo-banner">
        <div style={styles.banner}>
          {/* Background Particles */}
          <div style={styles.particles}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={styles.particle(
                  i * 0.8,
                  `${4 + Math.random() * 8}px`,
                  `${10 + Math.random() * 80}%`
                )}
              />
            ))}
          </div>

          {/* Animal Emoji - Main */}
          <div style={styles.animalImage}>
            <span style={styles.animalEmoji}>{currentPromo.emoji}</span>
            <span style={styles.animalName}>{currentPromo.animal}</span>
          </div>

          {/* Content */}
          <div style={styles.content}>
            <h2 style={styles.title}>{currentPromo.title}</h2>
            <p style={styles.subtitle}>{currentPromo.subtitle}</p>
            <p style={styles.description}>{currentPromo.description}</p>
            
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
              <span style={styles.promoCode}>
                📋 {currentPromo.promoCode}
              </span>
              <button style={styles.claimButton}>
                🎁 Claim Now
              </button>
            </div>
          </div>

          {/* Beautiful Girl Smiley Overlay (only on slide 4) */}
          {currentPromo.id === 4 && (
            <div style={styles.smilies}>
              💃 ✨ 💖
            </div>
          )}

          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            right: '5%',
            top: '10%',
            fontSize: '3em',
            opacity: 0.15,
            animation: 'spin 10s linear infinite',
          }}>
            {currentPromo.image}
          </div>
        </div>

        {/* Navigation Dots */}
        <div style={styles.dotsContainer}>
          {promotions.map((_, index) => (
            <button
              key={index}
              style={{
                ...styles.dot,
                ...(currentSlide === index ? styles.dotActive : {})
              }}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}