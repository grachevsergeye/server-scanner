const STORAGE_KEY =
    "scanner-sound-enabled";

let audioContext:
    AudioContext | null = null;

export function isScanSoundEnabled() {
    return (
        localStorage.getItem(
            STORAGE_KEY
        ) === "true"
    );
}

export async function setScanSoundEnabled(
    enabled: boolean
) {
    localStorage.setItem(
        STORAGE_KEY,
        String(enabled)
    );

    if (enabled) {
        await unlockAudio();
    }
}

async function unlockAudio() {
    if (!audioContext) {
        audioContext =
            new AudioContext();
    }

    if (
        audioContext.state ===
        "suspended"
    ) {
        await audioContext.resume();
    }
}

export async function playScanCompleteSound() {
    if (!isScanSoundEnabled()) {
        return;
    }

    try {
        await unlockAudio();

        if (!audioContext) {
            return;
        }

        const now =
            audioContext.currentTime;

        playTone(
            audioContext,
            660,
            now,
            0.12
        );

        playTone(
            audioContext,
            880,
            now + 0.13,
            0.18
        );
    } catch (error) {
        console.warn(
            "[Scanner] Could not play completion sound:",
            error
        );
    }
}

function playTone(
    context: AudioContext,
    frequency: number,
    start: number,
    duration: number
) {
    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value =
        frequency;

    gain.gain.setValueAtTime(
        0,
        start
    );

    gain.gain.linearRampToValueAtTime(
        0.12,
        start + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        start + duration
    );

    oscillator.connect(gain);
    gain.connect(
        context.destination
    );

    oscillator.start(start);
    oscillator.stop(
        start + duration
    );
}