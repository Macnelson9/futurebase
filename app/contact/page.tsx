import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 mt-20">
            <Pill className="mb-6">GET IN TOUCH</Pill>
            <h1 className="text-4xl md:text-6xl font-sentient mb-8">
              Let's <span className="text-primary">Connect</span>
            </h1>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              Have questions about FutureBase? Want to share your experience?
              We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-sentient mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 border border-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-mono">✉</span>
                    </div>
                    <div>
                      <h3 className="font-mono text-primary">EMAIL</h3>
                      <p className="text-foreground/70">hello@futurebase.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 border border-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-mono">🐦</span>
                    </div>
                    <div>
                      <h3 className="font-mono text-primary">TWITTER</h3>
                      <p className="text-foreground/70">@futurebase</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 border border-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-mono">💬</span>
                    </div>
                    <div>
                      <h3 className="font-mono text-primary">DISCORD</h3>
                      <p className="text-foreground/70">Join our community</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-sentient mb-4">Why Contact Us?</h3>
                <ul className="space-y-2 text-foreground/70">
                  <li>• Technical support and troubleshooting</li>
                  <li>• Feature requests and suggestions</li>
                  <li>• Partnership and collaboration opportunities</li>
                  <li>• Media and press inquiries</li>
                  <li>• Bug reports and feedback</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-sentient">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-sm mb-2 text-foreground/70">
                      NAME
                    </label>
                    <Input
                      className="bg-background border-primary/20 focus:border-primary"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-sm mb-2 text-foreground/70">
                      EMAIL
                    </label>
                    <Input
                      type="email"
                      className="bg-background border-primary/20 focus:border-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-sm mb-2 text-foreground/70">
                    SUBJECT
                  </label>
                  <Input
                    className="bg-background border-primary/20 focus:border-primary"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="block font-mono text-sm mb-2 text-foreground/70">
                    MESSAGE
                  </label>
                  <Textarea
                    className="bg-background border-primary/20 focus:border-primary min-h-[120px]"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <Button className="w-full">[SEND MESSAGE]</Button>
              </form>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl md:text-3xl font-sentient mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="border border-primary/20 p-6 rounded-lg">
                <h3 className="font-mono text-primary mb-4">
                  HOW SECURE ARE MY MESSAGES?
                </h3>
                <p className="text-sm text-foreground/70">
                  Your messages are encrypted with military-grade encryption and
                  stored on the blockchain, making them virtually impossible to
                  access before their unlock date.
                </p>
              </div>
              <div className="border border-primary/20 p-6 rounded-lg">
                <h3 className="font-mono text-primary mb-4">
                  CAN I DELETE A MESSAGE?
                </h3>
                <p className="text-sm text-foreground/70">
                  Once sent, messages cannot be deleted due to the immutable
                  nature of blockchain technology. This ensures the integrity of
                  your time capsules.
                </p>
              </div>
              <div className="border border-primary/20 p-6 rounded-lg">
                <h3 className="font-mono text-primary mb-4">
                  WHAT BLOCKCHAIN DO YOU USE?
                </h3>
                <p className="text-sm text-foreground/70">
                  We utilize Base and other EVM compatible networks to ensure
                  maximum security and decentralization.
                </p>
              </div>
              <div className="border border-primary/20 p-6 rounded-lg">
                <h3 className="font-mono text-primary mb-4">
                  IS THERE A MOBILE APP?
                </h3>
                <p className="text-sm text-foreground/70">
                  Currently, FutureBase is web-based. Mobile support is planned
                  for future releases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
