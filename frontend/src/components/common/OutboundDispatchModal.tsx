import { useState } from "react";
import { Send, CheckCircle2, MessageSquare, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { alertService } from "@/services";

export function OutboundDispatchModal({
  blockName,
  blockId,
  defaultTitle,
  defaultMessage,
  riskLevel = "HIGH",
}: {
  blockName: string;
  blockId: string;
  defaultTitle?: string;
  defaultMessage?: string;
  riskLevel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [language, setLanguage] = useState("hi");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [recipientType, setRecipientType] = useState("farmer");
  const [title, setTitle] = useState(defaultTitle || "Monsoon Break & Moisture Alert");
  const [message, setMessage] = useState(
    defaultMessage || "Delayed sowing advised. Expected dry spell for next 6 days."
  );
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      await alertService.dispatchNotification({
        recipient_type: recipientType,
        contact: phone,
        channel,
        language,
        block_id: blockId,
        title,
        message,
        risk_level: riskLevel,
      });
      toast.success(
        `Dispatched alert via ${channel.toUpperCase()} to ${recipientType} (${phone})`
      );
      setOpen(false);
    } catch (e) {
      toast.error("Failed to dispatch alert.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Send className="h-4 w-4" /> Dispatch Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Outbound Alert Gateway (SMS / WhatsApp)
          </DialogTitle>
          <DialogDescription>
            Broadcast hyper-local alerts directly to farmers or agricultural extension officers in their regional language.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Target Role</label>
              <Select value={recipientType} onValueChange={setRecipientType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">Farmer Community</SelectItem>
                  <SelectItem value="officer">Extension Officer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Channel</label>
              <Select value={channel} onValueChange={(v) => setChannel(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp Gateway</SelectItem>
                  <SelectItem value="sms">SMS Gateway</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                  <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                  <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Recipient Number</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Alert Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Message</label>
            <textarea
              className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Target Location: </span>
            {blockName} block · Verified with NCMRWF downscaling engine.
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending} className="gap-2">
            {sending ? "Sending..." : "Confirm & Broadcast"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
