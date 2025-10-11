import { Pill } from "@/components/pill";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 mt-20">
            <Pill className="mb-6">ABOUT FUTUREBASE</Pill>
            <h1 className="text-4xl md:text-6xl font-sentient mb-8">
              Preserving <span className="text-primary">Memories</span> for
              Tomorrow
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-sentient">
                Our Mission
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                FutureBase is a revolutionary platform that allows you to send
                messages to your future self, securely stored on the blockchain.
                Preserve your thoughts, dreams, and important moments that will
                be unlocked when the time is right.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Using cutting-edge encryption and decentralized technology, we
                ensure your messages remain private and tamper-proof until their
                designated unlock date.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-sentient">
                How It Works
              </h2>
              <div className="space-y-4">
                <div className="border border-primary/20 p-4 rounded-lg">
                  <h3 className="font-mono text-primary mb-2">1. WRITE</h3>
                  <p className="text-sm text-foreground/70">
                    Compose your message with a future unlock date
                  </p>
                </div>
                <div className="border border-primary/20 p-4 rounded-lg">
                  <h3 className="font-mono text-primary mb-2">2. ENCRYPT</h3>
                  <p className="text-sm text-foreground/70">
                    Your message is encrypted and stored on the blockchain
                  </p>
                </div>
                <div className="border border-primary/20 p-4 rounded-lg">
                  <h3 className="font-mono text-primary mb-2">3. WAIT</h3>
                  <p className="text-sm text-foreground/70">
                    Time passes, your message remains secure
                  </p>
                </div>
                <div className="border border-primary/20 p-4 rounded-lg">
                  <h3 className="font-mono text-primary mb-2">4. UNLOCK</h3>
                  <p className="text-sm text-foreground/70">
                    Your future self receives the message at the perfect moment
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl md:text-3xl font-sentient mb-8">
              Technology
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border border-primary/20 rounded-lg">
                <h3 className="font-mono text-primary mb-4">BLOCKCHAIN</h3>
                <p className="text-sm text-foreground/70">
                  Immutable storage ensures your messages cannot be altered or
                  deleted
                </p>
              </div>
              <div className="p-6 border border-primary/20 rounded-lg">
                <h3 className="font-mono text-primary mb-4">ENCRYPTION</h3>
                <p className="text-sm text-foreground/70">
                  Military-grade encryption keeps your private thoughts secure
                </p>
              </div>
              <div className="p-6 border border-primary/20 rounded-lg">
                <h3 className="font-mono text-primary mb-4">IPFS</h3>
                <p className="text-sm text-foreground/70">
                  Decentralized file storage for maximum reliability and
                  accessibility
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
