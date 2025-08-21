import { useRouter } from 'next/navigation';
import { useFullscreen } from '@/components/FullscreenContext';
import { useSound } from '@/components/SoundContext';
import { FaArrowLeft, FaUndo, FaPlay, FaQuestionCircle } from 'react-icons/fa';
import { MdExitToApp } from 'react-icons/md';
// Use public asset paths directly (Next.js serves files in /public at the root path)
const powerSupplyBoard = '/game_images/power supply board.svg';
const ledboard = '/game_images/led board.svg';
const battery = '/game_images/9vbattery.svg';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useAnimation } from "framer-motion";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
// Add these types at the top of the file
type CircuitNodeType = '5V' | 'GND' | 'LED_POSITIVE' | 'LED_NEGATIVE';

interface CircuitNode {
  id: string;
  type: CircuitNodeType;
  x: number;
  y: number;
}

interface Connection {
  from: CircuitNode;
  to: CircuitNode;
}

type WirePathKey = '5V_LED_POSITIVE' | 'LED_POSITIVE_5V' | 'GND_LED_NEGATIVE' | 'LED_NEGATIVE_GND';

// Add manual wire paths object
const MANUAL_WIRE_PATHS: Record<WirePathKey, string> = {
  '5V_LED_POSITIVE': 'M 590 299 L 590 270 L 400 270 L 285 270 L 285 210',  // 5V to LED+
  'LED_POSITIVE_5V': 'M 285 210 L 285 270 L 400 270 L 590 270 L 590 299',  // LED+ to 5V
  'GND_LED_NEGATIVE': 'M 591 319 L 591 360 L 315 360 L 315 210',  // GND to LED-
  'LED_NEGATIVE_GND': 'M 315 210 L 315 360 L 591 360 L 591 319'   // LED- to GND
};

export default function Experiment1() {
  const router = useRouter();
  const { setIsFullscreen } = useFullscreen();
  const { playSound } = useSound();
  const [batteryX, setBatteryX] = useState(700);
  const [isWireConnected, setIsWireConnected] = useState(false);
  const [isGndWireConnected, setIsGndWireConnected] = useState(false);
  const [selectedNode, setSelectedNode] = useState<CircuitNode | null>(null);
  const [wireDirection, setWireDirection] = useState<'left' | 'right'>('left');
  const [gndWireDirection, setGndWireDirection] = useState<'left' | 'right'>('left');
  const [showSimulationButton, setShowSimulationButton] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isLedOn, setIsLedOn] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [showHelpHighlight, setShowHelpHighlight] = useState(true);
  const wireControls = useAnimation();
  const gndWireControls = useAnimation();
  const [isFullscreen, setIsFullscreenState] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleBack = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if ((document as any).webkitFullscreenElement) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozFullScreenElement) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msFullscreenElement) {
        await (document as any).msExitFullscreen();
      }
      router.push('/learn');
    } catch (err) {
      console.log('Error exiting fullscreen:', err);
      router.push('/learn');
    }
  };

  // Define circuit nodes
  const circuitNodes: CircuitNode[] = [
    { id: '5v', type: '5V', x: 590, y: 289 },
    { id: 'gnd', type: 'GND', x: 591, y: 309 },
    { id: 'led_pos', type: 'LED_POSITIVE', x: 275, y: 200 },
    { id: 'led_neg', type: 'LED_NEGATIVE', x: 305, y: 200 },
  ];

  // Enhanced fullscreen handling with user gesture and safe guards
  useEffect(() => {
    let wakeLock: any = null;

    const tryOrientationLock = async () => {
      try {
        // Some browsers require fullscreen + user gesture; guard thoroughly
        if (
          typeof screen !== 'undefined' &&
          (screen as any).orientation &&
          typeof (screen as any).orientation.lock === 'function'
        ) {
          await (screen as any).orientation.lock('landscape');
        }
      } catch (_err) {
        // Silently ignore NotSupportedError / SecurityError
      }
    };

    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        setIsFullscreenState(true);
        await tryOrientationLock();
      } catch (_err) {
        // Silently ignore permission or gesture errors
      }
    };

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && document.visibilityState === 'visible') {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          if (wakeLock && typeof wakeLock.addEventListener === 'function') {
            wakeLock.addEventListener('release', () => {});
          }
        }
      } catch (_err) {
        // Ignore wake lock permission errors
      }
    };

    // Enter fullscreen only after a user gesture
    const onFirstUserGesture = async () => {
      await enterFullscreen();
      await requestWakeLock();
      window.removeEventListener('click', onFirstUserGesture);
      window.removeEventListener('touchstart', onFirstUserGesture);
    };
    window.addEventListener('click', onFirstUserGesture, { once: true });
    window.addEventListener('touchstart', onFirstUserGesture, { once: true });

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        await requestWakeLock();
      } else if (wakeLock) {
        try { await wakeLock.release(); } catch {}
        wakeLock = null;
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreenState(!!document.fullscreenElement);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('click', onFirstUserGesture);
      window.removeEventListener('touchstart', onFirstUserGesture);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (wakeLock) {
        try { wakeLock.release(); } catch {}
      }
    };
  }, [setIsFullscreen]);

  const handleBatteryClick = () => {
    if (isSimulationMode) return;
    setBatteryX(prev => prev === 700 ? 620 : 700);
    playSound('click');
    toast.success('Battery moved! 🔋', {
      duration: 500,
      style: {
        background: '#4CAF50',
        color: 'white',
        fontSize: '14px',
        padding: '5px 10px',
      }
    });
  };

  const triggerConfetti = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

  const canConnect = (node1: CircuitNode, node2: CircuitNode) => {
    return (
      (node1.type === '5V' && node2.type === 'LED_POSITIVE') ||
      (node1.type === 'LED_POSITIVE' && node2.type === '5V') ||
      (node1.type === 'GND' && node2.type === 'LED_NEGATIVE') ||
      (node1.type === 'LED_NEGATIVE' && node2.type === 'GND')
    );
  };

  const handleNodeClick = (node: CircuitNode) => {
    if (isSimulationMode) return;

    if (!selectedNode) {
      setSelectedNode(node);
      playSound('click');
      toast.success(`Selected ${node.type} terminal! Now click a matching terminal!`, {
        duration: 500,
        style: {
          background: '#4CAF50',
          color: 'white',
          fontSize: '12px',
          padding: '5px 10px',
        }
      });
      return;
    }

    // If clicking the same node, deselect it
    if (selectedNode.id === node.id) {
      setSelectedNode(null);
      playSound('click');
      setConnections(prev => prev.filter(conn => 
        conn.from.id !== node.id && conn.to.id !== node.id
      ));
      return;
    }

    // Try to make a connection
    if (canConnect(selectedNode, node)) {
      const newConnection: Connection = {
        from: selectedNode,
        to: node,
      };

      // Determine if this is a positive or negative connection
      const isPositiveConnection = selectedNode.type === '5V' || node.type === '5V' ||
                                 selectedNode.type === 'LED_POSITIVE' || node.type === 'LED_POSITIVE';

      // Set wire direction based on connection type
      if (isPositiveConnection) {
        setWireDirection(selectedNode.type === '5V' ? 'right' : 'left');
        setIsWireConnected(true);
        wireControls.start({ pathLength: 1, transition: { duration: 0.8, ease: "easeInOut" } });
      } else {
        setGndWireDirection(selectedNode.type === 'GND' ? 'right' : 'left');
        setIsGndWireConnected(true);
        gndWireControls.start({ pathLength: 1, transition: { duration: 0.8, ease: "easeInOut" } });
      }

      setConnections(prev => [...prev, newConnection]);
      playSound('connection');
      
      toast.success('Connection made! ✨', {
        duration: 500,
        style: {
          background: '#4CAF50',
          color: 'white',
          fontSize: '12px',
          padding: '5px 10px',
        }
      });
    } else {
      playSound('error');
      toast.error('Invalid connection! Try connecting matching terminals.', {
        duration: 500,
        style: {
          background: '#f44336',
          color: 'white',
          fontSize: '12px',
          padding: '5px 10px',
        }
      });
    }
    setSelectedNode(null);
  };

  // Update the circuit completion check
  useEffect(() => {
    const hasPositiveConnection = connections.some(conn => 
      (conn.from.type === '5V' && conn.to.type === 'LED_POSITIVE') ||
      (conn.from.type === 'LED_POSITIVE' && conn.to.type === '5V')
    );
    
    const hasNegativeConnection = connections.some(conn => 
      (conn.from.type === 'GND' && conn.to.type === 'LED_NEGATIVE') ||
      (conn.from.type === 'LED_NEGATIVE' && conn.to.type === 'GND')
    );

    if (hasPositiveConnection && hasNegativeConnection && batteryX === 620 && !showSimulationButton) {
      setTimeout(() => {
        playSound('success');
        toast.success('Circuit complete! Ready for simulation! ✨', {
          duration: 500,
          style: {
            background: '#4CAF50',
            color: 'white',
            fontSize: '12px',
            padding: '5px 10px',
          },
          icon: '✨',
        });
        
        triggerConfetti();
        setShowSimulationButton(true);
      }, 500);
    }
  }, [connections, batteryX, showSimulationButton, triggerConfetti, playSound]);

  const handleSimulationMode = () => {
    setIsSimulationMode(true);
    setIsLedOn(true);
    // Reset zoom and position when entering simulation mode
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    playSound('success');
  };

  const handleLedToggle = () => {
    setIsLedOn(!isLedOn);
    playSound('click');
    toast.success(`LED turned ${!isLedOn ? 'on' : 'off'}!`, {
      duration: 500,
      style: {
        background: '#4CAF50',
        color: 'white',
        fontSize: '12px',
        padding: '5px 10px',
      }
    });
  };

  const handleExitSimulation = () => {
    setIsSimulationMode(false);
    setIsLedOn(false);
    handleReset();
  };

  // Handle completion: award XP and mark interactive game challenge as completed
  const handleComplete = async () => {
    if (isCompleting) return;
    try {
      setIsCompleting(true);
      // extract challengeId from URL query (?challengeId=123)
      const params = new URLSearchParams(window.location.search);
      const challengeIdParam = params.get('challengeId');
      const challengeId = challengeIdParam ? parseInt(challengeIdParam, 10) : NaN;

      if (!challengeId || Number.isNaN(challengeId)) {
        toast.error('Missing challenge id. Please open this game from Learn page.');
        setIsCompleting(false);
        return;
      }

      // Call API to award XP and mark completion
      const res = await fetch('/api/challenge-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      });

      if (!res.ok) {
        throw new Error('Failed to complete challenge');
      }

      // Navigate to completed page. We do NOT pass xp to avoid double-crediting,
      // because /api/challenge-complete already awarded XP and updated streak.
      router.push(`/completed?challengeId=${challengeId}`);
    } catch (e) {
      console.error(e);
      toast.error('Could not complete. Try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  // Update the reset function
  const handleReset = () => {
    setConnections([]);
    setSelectedNode(null);
    setIsWireConnected(false);
    setIsGndWireConnected(false);
    setWireDirection('left');
    setGndWireDirection('left');
    setShowSimulationButton(false);
    setIsSimulationMode(false);
    setIsLedOn(false);
    setBatteryX(700);
    playSound('click');
    wireControls.set({ pathLength: 0 });
    gndWireControls.set({ pathLength: 0 });

    toast.success('All connections reset! ✨', {
      duration: 2000,
      style: {
        background: '#4CAF50',
        color: 'white',
        fontSize: '12px',
        padding: '5px 10px',
      }
    });
  };

  const handleEnterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if ('orientation' in screen && screen.orientation && 'lock' in screen.orientation) {
          try {
            await (screen.orientation as any).lock('landscape');
          } catch (err) {
            console.warn('Orientation lock not supported or failed:', err);
          }
        } else {
          console.warn('Orientation lock API not supported on this device.');
        }
      }
      setIsFullscreenState(true);
    } catch (err) {
      console.error('Error entering fullscreen:', err);
    }
  };

  const getWirePath = (from: CircuitNode, to: CircuitNode) => {
    // Check for manual wire path first
    const connectionKey = `${from.type}_${to.type}` as WirePathKey;
    const reverseConnectionKey = `${to.type}_${from.type}` as WirePathKey;
    
    if (MANUAL_WIRE_PATHS[connectionKey]) {
      return MANUAL_WIRE_PATHS[connectionKey];
    }
    if (MANUAL_WIRE_PATHS[reverseConnectionKey]) {
      return MANUAL_WIRE_PATHS[reverseConnectionKey];
    }

    // If no manual path exists, use the default path logic
    const fromX = from.x + 10;
    const fromY = from.y + 10;
    const toX = to.x + 10;
    const toY = to.y + 10;

    // For power supply connections (5V and GND)
    if (from.type === '5V' || from.type === 'GND' || to.type === '5V' || to.type === 'GND') {
      const powerNode = from.type === '5V' || from.type === 'GND' ? from : to;
      const otherNode = from.type === '5V' || from.type === 'GND' ? to : from;
      
      // Calculate the routing points for the bent path
      const routingY = powerNode.y + 10;
      const routingX = (powerNode.x + otherNode.x) / 2;
      
      return `M ${fromX} ${fromY} 
              L ${fromX} ${routingY} 
              L ${routingX} ${routingY} 
              L ${routingX} ${toY} 
              L ${toX} ${toY}`;
    }

    // For direct LED connections
    const midY = (fromY + toY) / 2;
    return `M ${fromX} ${fromY} L ${fromX} ${midY} L ${toX} ${midY} L ${toX} ${toY}`;
  };

  const getWireColor = (from: CircuitNode, to: CircuitNode) => {
    // If either terminal is 5V or LED_POSITIVE, use red
    if (from.type === '5V' || to.type === '5V' ||
        from.type === 'LED_POSITIVE' || to.type === 'LED_POSITIVE') {
      return '#FF0000';
    }
    // If either terminal is GND or LED_NEGATIVE, use black
    if (from.type === 'GND' || to.type === 'GND' || 
        from.type === 'LED_NEGATIVE' || to.type === 'LED_NEGATIVE') {
      return '#000000';
    }
    return '#000000'; // Default color
  };


  // Add touch handlers for pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setDragStart({ x: distance, y: 0 });
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const delta = distance - dragStart.x;
      const newZoom = Math.max(0.5, Math.min(2, zoom + delta * 0.01));
      setZoom(newZoom);
      setDragStart({ x: distance, y: 0 });
    } else if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ userSelect: 'none' }} className="min-h-screen min-w-screen bg-white flex flex-col overflow-hidden fixed inset-0 p-2">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 1000,
          style: {
            background: '#4CAF50',
            color: 'white',
            fontSize: '12px',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        }}
      />
      {/* Title Section - 10vh */}
      <div className="bg-blue-200 h-[10vh] flex items-center -full border-b border-blue-200 p-5 rounded-md">
        <p className='text-center text-black-800 text-mg font-semibold'>
          {isSimulationMode ? 'Simulation Mode - click the button to turn the LED on and off' : 'Connect the wires! Match 5V to LED + and GND to LED - to light up the LED! ✨'}
        </p>
      </div>

      <div className='items-center justify-center w-full h-[90vh] bg-gray-50 relative'>
        {/* Only show zoom controls when not in simulation mode */}
        {/* Zoom controls removed as per request */}

        <svg 
          ref={svgRef}
          className={`w-full h-full transition-all duration-300 ${showSimulationButton && !isSimulationMode ? 'blur-md' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid meet"
          onTouchStart={!isSimulationMode ? handleTouchStart : undefined}
          onTouchMove={!isSimulationMode ? handleTouchMove : undefined}
          onTouchEnd={!isSimulationMode ? handleTouchEnd : undefined}
          style={{
            transform: !isSimulationMode ? `scale(${zoom}) translate(${position.x}px, ${position.y}px)` : 'none',
            transformOrigin: 'center center',
            touchAction: isSimulationMode ? 'auto' : 'none'
          }}
        >
          {/* Grid Background Pattern */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>
          
          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Power Supply board wit Terminals */}
        <g transform="rotate(0, 500, 500)">
          <image 
            href={powerSupplyBoard} 
            x="650" 
            y="500"
            width="200" 
            height="200" 
            preserveAspectRatio="xMidYMid meet"
            transform="rotate(-90, 500, 500)"
          />  
            {/* 5V Terminal */}
            <rect
              x="583"
              y="289"
              width="20"
              height="20"
                fill={selectedNode?.id === '5v' ? '#ff6666' : '#FF0000'}
                stroke={selectedNode?.id === '5v' ? '#cc0000' : '#000'}
              strokeWidth="2"
              rx="3"
                style={{ cursor: isSimulationMode ? 'default' : 'pointer' }}
                onClick={() => handleNodeClick(circuitNodes[0])}
            />
           

            {/* GND Terminal */}
            <rect
              x="583"
              y="309"
              width="20"
              height="20"
                fill={selectedNode?.id === 'gnd' ? '#666666' : '#000000'}
                stroke={selectedNode?.id === 'gnd' ? '#333333' : '#000'}
              strokeWidth="2"
              rx="3"
                style={{ cursor: isSimulationMode ? 'default' : 'pointer' }}
                onClick={() => handleNodeClick(circuitNodes[1])}
            />
          
          </g>  
      {/* LED Board Terminals */}
      <g transform="rotate(0, 500, 500)">
          <image 
            href={ledboard} 
            x="320" 
            y="500"
            width="200" 
            height="200" 
            preserveAspectRatio="xMidYMid meet"
            transform="rotate(90, 600, 300)"
          />
            {/* Positive (+) Terminal */}
            <rect
              x="275"
              y="200"
              width="20"
              height="20"
              fill={selectedNode?.id === 'led_pos' ? '#ff6666' : '#FF0000'}
              stroke={selectedNode?.id === 'led_pos' ? '#cc0000' : '#000'}
              strokeWidth="2"
              rx="3"
              style={{ cursor: isSimulationMode ? 'default' : 'pointer' }}
              onClick={() => handleNodeClick(circuitNodes[2])}
            />
           
            {/* Negative (-) Terminal */}
            <rect
              x="305"
              y="200"
              width="20"
              height="20"
              fill={selectedNode?.id === 'led_neg' ? '#666666' : '#000000'}
              stroke={selectedNode?.id === 'led_neg' ? '#333333' : '#000'}
              strokeWidth="2"
              rx="3"
              style={{ cursor: isSimulationMode ? 'default' : 'pointer' }}
              onClick={() => handleNodeClick(circuitNodes[3])}
            />
           
          </g>

          {/* Wire Connections */}
          {connections.map((connection, index) => (
            <motion.path
              key={index}
              d={getWirePath(connection.from, connection.to)}
              stroke={getWireColor(connection.from, connection.to)}
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Positive Wire Connection with Animation */}
          {(isWireConnected && connections.some(conn => 
            (conn.from.id === '5v' && conn.to.id === 'led_pos') ||
            (conn.from.id === 'led_pos' && conn.to.id === '5v')
          )) && (
            <motion.path
              d={wireDirection === 'left' 
                ? MANUAL_WIRE_PATHS.LED_POSITIVE_5V
                : MANUAL_WIRE_PATHS['5V_LED_POSITIVE']}
              stroke="#FF0000"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={wireControls}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Negative Wire Connection with Animation */}
          {(isGndWireConnected && connections.some(conn => 
            (conn.from.id === 'gnd' && conn.to.id === 'led_neg') ||
            (conn.from.id === 'led_neg' && conn.to.id === 'gnd')
          )) && (
            <motion.path
              d={gndWireDirection === 'left'
                ? MANUAL_WIRE_PATHS.LED_NEGATIVE_GND
                : MANUAL_WIRE_PATHS.GND_LED_NEGATIVE}
              stroke="#000000"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={gndWireControls}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

        <motion.image
          href={battery}
          initial={{ x: 700 }}
          animate={{ x: batteryX }}
          y="170"
          width="300"
          height="300"
          preserveAspectRatio="xMidYMid meet"
          onClick={handleBatteryClick}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        style={{ cursor: isSimulationMode ? 'default' : 'pointer' }}
      />

      {/* LED Board with Glowing Effect */}
      <g transform="rotate(0, 500, 500)">
        <image 
          href={ledboard} 
          x="320" 
          y="500"
          width="200" 
          height="200"
          preserveAspectRatio="xMidYMid meet"
          transform="rotate(90, 600, 300)"
        />
        {/* Positive (+) Terminal */}
        <rect
          x="275"
          y="200"
          width="20"
          height="20"
          fill={selectedNode?.id === 'led_pos' ? '#ff6666' : '#FF0000'}
          stroke={selectedNode?.id === 'led_pos' ? '#cc0000' : '#000'}
          strokeWidth="2"
          rx="3"
          style={{ cursor: isSimulationMode ? 'default' : 'pointer' }}
          onClick={() => handleNodeClick(circuitNodes[2])}
        />
       
        {/* Negative (-) Terminal */}
        <rect
          x="305"
          y="200"
          width="20"
          height="20"
          fill={selectedNode?.id === 'led_neg' ? '#666666' : '#000000'}
          stroke={selectedNode?.id === 'led_neg' ? '#333333' : '#000'}
          strokeWidth="2"
          rx="3"
          style={{ cursor: isSimulationMode ? 'default' : 'pointer' }}
          onClick={() => handleNodeClick(circuitNodes[3])}
        />

        {/* Glowing LED Circle */}
        {isSimulationMode && (
          <>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <radialGradient id="ledGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#0cdbf8', stopOpacity: 1 }} />
              </radialGradient>
            </defs>
            <circle
              cx="300"
              cy="50"
              r={isLedOn ? '50' : '5'}
              fill={isLedOn ? 'url(#ledGradient)' : '#0cdbf8'}
              filter="url(#glow)"
              opacity="0.9"
            />
          </>
        )}
      </g>

      {/* On/Off Button */}
      {isSimulationMode && (
        <g transform="translate(650, 230)">
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            fill={isLedOn ? '#f44336' : '#4CAF50'}
            stroke="#000"
            strokeWidth="1"
            rx="10"
            style={{ cursor: 'pointer' }}
            onClick={handleLedToggle}
          />
          <text
            x="20"
            y="20"
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            {isLedOn ? 'OFF' : 'ON'}
          </text>
        </g>
      )}
      </svg>

     {/* Duolingo-style CSS */}
     <style>{`
      
     }`}</style>

     {/* Control Buttons */}
     <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
       <Button
         onClick={handleBack}
        
       >
         <FaArrowLeft className="mr-1 text-base" /> Back
       </Button>
   
       {!isSimulationMode && (connections.length > 0 || batteryX !== 700) && (
         <Button
           onClick={handleReset}
         >
           <FaUndo className="mr-1 text-base" /> Reset
         </Button>
       )}
   
       <Button
         onClick={() => {
           setShowHelp(!showHelp);
           setShowHelpHighlight(false);
         }}
         variant='secondary'
       >
         <FaQuestionCircle className="mr-1 text-base" /> Help
       </Button>
   
       {isSimulationMode && (
         <Button
           onClick={handleExitSimulation}
           variant='secondary'
         >
           <MdExitToApp className="mr-1 text-base" /> Exit
         </Button>
       )}
     </div>


     {/* Help Modal */}
     {showHelp && (
       <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-40">
         <div className="bg-white p-6 rounded-2xl max-w-md">
           <h2 className="text-2xl font-bold text-[#4b4b4b] mb-4">How to Play</h2>
           <ol className="list-decimal pl-5 space-y-2 text-[#4b4b4b]">
             <li>Click on the battery to move it into position</li>
             <li>Click on the 5V terminal (red) and then click on the LED positive terminal (also red)</li>
             <li>Click on the GND terminal (black) and then click on the LED negative terminal (also black)</li>
             <li>Once the circuit is complete, click "Start Simulation" to see the LED light up!</li>
             <li>In simulation mode, you can turn the LED on and off</li>
           </ol>
           <button 
             onClick={() => setShowHelp(false)}
             className="mt-6 w-full py-3 bg-[#58CC02] text-white font-bold rounded-xl hover:bg-[#46a302] shadow-md transition-all"
           >
             Got it!
           </button>
         </div>
       </div>
     )}

     {/* Simulation Button */}
     {showSimulationButton && !isSimulationMode && (
       <div className='absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-20'>
         <div className="relative flex flex-col items-center gap-2">
           <div className="flex gap-2">
             <div style={{ transform: 'scale(1.0878) rotate(-23.8561deg)', filter: 'brightness(1.21949)', animation: 'spin 3s linear infinite' }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-16 h-16 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
               </svg>
             </div>
             <div style={{ transform: 'scale(1.16019) rotate(-45.1312deg)', filter: 'brightness(1.40047)', animation: 'spin 3s linear infinite reverse' }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-16 h-16 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
               </svg>
             </div>
             <div style={{ transform: 'scale(1.19343) rotate(-70.947deg)', filter: 'brightness(1.48358)', animation: 'spin 3s linear infinite' }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-16 h-16 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
               </svg>
             </div>
           </div>
           <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-base font-bold shadow-lg">
             Yay! You did it! 🎉
           </div>
           <motion.button 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: "spring", stiffness: 260, damping: 20 }}
             onClick={handleSimulationMode}
             className="flex items-center justify-center px-6 py-4 bg-[#58CC02] text-white text-xl font-bold rounded-2xl hover:bg-[#46a302] shadow-lg transition-all"
           >
             <FaPlay className="mr-2" /> Start Simulation
           </motion.button>
         </div>
       </div>
     )}
  
     {/*make comple button*/}
     {isSimulationMode && (
       <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-3">
         <Button
           onClick={handleComplete}
           variant='secondary'
         >
           Complete
         </Button>
       </div>
     )}
   </div>

  

  {!isFullscreen && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
      <button
        onClick={handleEnterFullscreen}
        className="px-6 py-3 bg-blue-500 font-semibold text-white text-lg rounded-md shadow-lg hover:bg-blue-400 active:bg-blue-600 transition-colors"
      >
        Click to Enter Fullscreen
      </button>
    </div>
  )}
  </div>
);
}

// Add keyframes for spin and fadeIn animations
const styles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}