import { useState, useEffect, useRef, useMemo } from "react";

/* ═══ THE OBJECTION PLAYBOOK — v2 tokens ═══
   light + airy · light blue coach's voice · Apex orange for YOUR moves
   Display: Jost (ITC Avant Garde equivalent) · Body/UI: Inter        */
const T = {
  page: "#F6F9FB", panel: "#FFFFFF", tint: "#EEF4F8", line: "#DCE6EE",
  ink: "#16212B", sub: "#4E5D6B", faint: "#8A99A8",
  blue: "#3E8FCC", blueDeep: "#2F73A8", blueTint: "#E9F3FB",
  or: "#F47C35", orDeep: "#DD640D", orTint: "#FDEDE0",
  good: "#1F7A4D", okay: "#96700F", poor: "#B04430",
  goodTint: "rgba(31,122,77,0.1)", okayTint: "rgba(150,112,15,0.12)", poorTint: "rgba(176,68,48,0.1)",
};
const FD = "'Jost', system-ui, sans-serif";
const FS = "'Inter', system-ui, sans-serif";

const seedHash = (str) => { let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; } return Math.abs(h); };
const shuffleOpts = (opts, nodeId) => {
  const s = seedHash(nodeId);
  const arr = opts.map((o, i) => ({ ...o, _origIdx: i }));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = ((s * (i + 1) * 2654435761) >>> 0) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const PRINC = {
  empathy: { name: "Empathy", short: "EMP", desc: "Make them feel understood before you make your case" },
  discovery: { name: "Discovery", short: "DIS", desc: "Their answers are your roadmap — ask before you tell" },
  framing: { name: "Reframing", short: "REF", desc: "Change the lens they see through, not just the information" },
  momentum: { name: "Momentum", short: "MOM", desc: "Every conversation needs a concrete, small next step" },
};
const S1 = {
  id: "split", title: "\"Your Cut Is Too Much\"",
  subtitle: "Oak Ridge Elementary — Follow-Up Visit with Principal",
  difficulty: "Advanced",
  setting: "Mr. Torres is a former finance guy turned principal. He liked your first meeting and invited you back — but he found the revenue split online and has questions. He's analytical, fair-minded, and will respect transparency. His PTA treasurer will need convincing too.",
  persona: "Mr. Torres — Numbers-driven, values transparency above everything. Won't accept vague answers. If you earn his trust with data, he becomes your champion.",
  teaches: ["Net-dollars reframe", "Breaking down the 48%", "Arming your champion", "Anchoring value before price", "Ghost product trust-building"],
  nodes: {
    start: {
      speaker: "them", name: "Mr. Torres",
      text: "Thanks for coming back. I'll be direct — I looked into your model after we met. I like the concept. But 48% is a big number. My PTA treasurer is going to ask why we're giving away nearly half the money, and I need a real answer.",
      options: [
        { text: "I'm glad you brought that up — honestly, I'd be worried about anyone who didn't push on the numbers. Is it the percentage kept, the total net dollars, or something else?",
          next: "a1", scores: { empathy: 2, discovery: 3, framing: 1, momentum: 1 }, rating: "excellent",
          feedback: "You validated his skepticism (Carnegie: never criticize the concern), then used a Situation question from the SPIN framework to understand HOW his treasurer thinks. Her evaluation metric will tell you exactly which reframe to lead with. You also just told him, without saying it, that there's more than one way to evaluate this.",
          principle: "SPIN Selling: before you respond to any price objection, ask a Situation question that reveals how the prospect evaluates value. The answer tells you which reframe will land. Responding without this is prescribing before diagnosing."
        },
        { text: "I hear you. But here's the question: would you rather keep 90% of $12,000, or 52% of $45,000? At the end of the day, it's about how much your school actually deposits.",
          next: "b1", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
          feedback: "The reframe is correct, but you fired your best shot before understanding his frame. An analytical buyer's first instinct is to challenge your numbers — 'How do you know we'd raise $45K?' — and now you're defending hypotheticals instead of building the case. You also skipped the most important move: making him feel heard first.",
          principle: "Voss's tactical empathy: people are not ready to hear your logic until they feel understood. When you jump to the reframe before acknowledging the concern, even correct math feels like a dodge. Empathy first, substance second — always in that order."
        },
        { text: "I won't sugarcoat it — 48% is what it costs to deliver a two-week, fully managed program with a professional team on campus every day. But I think once you see the results, the ROI speaks for itself.",
          next: "b1", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
          feedback: "You framed 48% as a 'cost' — that's the worst possible anchor. In the Anchoring Effect (Kahneman), the first frame introduced controls the entire conversation. You just anchored his mental model on expense instead of investment. And 'ROI speaks for itself' is a cliché that an analytical buyer will see through immediately.",
          principle: "Never position your price as a cost. The language shift matters: 'costs' → 'covers' → 'goes directly toward' → 'delivers.' Each word moves the frame from expense to investment. And never tell an analytical buyer to 'trust the results' — give them the math."
        }
      ]
    },
    a1: {
      speaker: "them", name: "Mr. Torres",
      text: "Percentage kept. Every time. She'll see 48% and compare it to the PTA running a catalog sale where they keep 85% or a GoFundMe where they keep 97%. That's the conversation I'll be walking into.",
      options: [
        { text: "That makes sense — and she's doing her job by comparing that way. Can I ask — what did Oak Ridge raise with your last fundraiser, and roughly how many volunteer hours went into it?",
          next: "a2", scores: { empathy: 2, discovery: 3, framing: 1, momentum: 1 }, rating: "excellent",
          feedback: "You validated the treasurer's approach (she's doing her job), then planted a Challenger insight — percentage only matters if the denominators are comparable — without being heavy-handed about it. The discovery question that follows will give you the EXACT numbers you need for the net-dollars reframe. Now it's his data, not your hypothetical.",
          principle: "Challenger Sale: teach something new by introducing a reframe BEFORE the data. 'Percentage is only useful if the base numbers are comparable' is a genuine insight that changes how he evaluates the split. Then use Gap Selling: understand his current state (what they raised, what it cost in hours) so the gap between where he is and where he could be becomes concrete."
        },
        { text: "I get that. So let me break down exactly where the 48% goes — I think the picture changes when you see it's not just 'Apex's cut.' About half of it, roughly 24%, goes directly back to your students: the team on campus for ten days, t-shirts for every kid, teacher incentives, classroom awards, DJ, equipment, prizes.",
          next: "b2", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
          feedback: "The breakdown is accurate and helpful — he asked for specifics and you're giving them. But you skipped a critical step: you don't yet know what Oak Ridge currently raises. Without their current number, the 48% sits in a vacuum. You need his baseline to make the net-dollars comparison land. Always get THEIR data first.",
          principle: "SPIN Selling: the most common mistake is responding to a Problem question (the split concern) by jumping to your solution. Rackham's research shows this is premature — a problem acknowledged is not yet a problem the prospect is motivated to solve. You need Implication questions first: what does their current approach actually cost them?"
        },
        { text: "What if I put together a side-by-side comparison she could look at? Net dollars at different fundraising levels, what the 48% covers, volunteer hours saved. That way she's got real numbers, not just a percentage.",
          next: "b2", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
          feedback: "Helpful instinct — arming the champion with tools. But you offered the deliverable before understanding his current situation. The one-pager will be generic without Oak Ridge's actual numbers in it. Ask for his baseline first, THEN offer a customized comparison. Generic tools get skimmed; personalized tools get shared.",
          principle: "The Challenger Customer: internal champions succeed when they have tailored tools for each stakeholder. A one-pager with Oak Ridge's actual numbers ('You raised $9,000 last year. Here's what that looks like at Apex scale.') is 10x more compelling than a generic comparison sheet."
        }
      ]
    },
    b1: {
      speaker: "them", name: "Mr. Torres",
      text: "Maybe. But I can't walk into a PTA meeting with hypothetical revenue numbers. They'll see 48% and that's the conversation. How do I defend that?",
      options: [
        { text: "You shouldn't have to defend it in a vacuum — let me arm you with the real picture. Can I ask: what did Oak Ridge raise last year, and roughly how many hours did your PTA put into it?",
          next: "a2", scores: { empathy: 2, discovery: 3, framing: 1, momentum: 1 }, rating: "excellent",
          feedback: "Good recovery. You reframed 'defending' into 'arming' — that puts you on his side of the table (Hormozi: move from across the table to shoulder-to-shoulder). And asking for his real numbers instead of using your own is a trust accelerator. You're showing your math will be built from HIS reality, not your marketing materials.",
          principle: "Ghost Product principle (Hormozi): you build trust by showing you're willing to work from THEIR data, not yours. When you say 'I'd rather use your numbers than mine,' you're making a small sacrifice — you might lose the favorable comparison — but you gain credibility that's worth 10x more."
        },
        { text: "Here's what I'd suggest: let me put together a one-page breakdown — the investment, net dollar comparison, what the 48% covers — that you can share with the treasurer. That way you're armed with specifics, not defending a percentage in a vacuum.",
          next: "b2", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
          feedback: "The offer is good — you're trying to equip your champion. But without knowing what Oak Ridge currently raises, your one-pager will be generic. The strongest move is to get his current numbers first, then build the comparison around them.",
          principle: "Tailoring (Challenger Sale): the same tool doesn't work for every school. A one-pager built around Oak Ridge's actual fundraising numbers hits different than a generic comparison. Ask, then build."
        },
        { text: "Honestly, the best defense is the results. Every school that partners with us is surprised by how much they raise. The percentage becomes background noise once the check comes in.",
          next: "c2", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
          feedback: "You just told a numbers-driven principal that numbers become background noise. His PTA treasurer lives in Excel — she is not going to find 'trust the results' compelling. He asked HOW to defend it and you said 'don't worry about it.' That's the fastest way to lose an analytical buyer.",
          principle: "The Trust Equation (Maister & Green): Trust = (Credibility + Reliability + Intimacy) / Self-Orientation. When you wave away a legitimate concern with 'trust the results,' your Self-Orientation spikes — it reads as 'I care more about closing this than answering your question.' Credibility requires specifics, not promises."
        }
      ]
    },
    a2: {
      speaker: "them", name: "Mr. Torres",
      text: "We did a catalog sale through the PTA. Brought in about $11,000. And honestly? I'd guess the PTA president spent 80 to 100 hours coordinating it — orders, distribution, follow-up with families who didn't pay. She was here until 8 PM three nights in a row during distribution week.",
      options: [
        { text: "So $11,000 raised, roughly 100 hours of volunteer labor. If you paid for those hours at even $20 an hour, that's $2,000 in donated time — bringing the real cost of that $11,000 closer to $9,000 net.",
          next: "a3", scores: { empathy: 1, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
          feedback: "This is the net-dollars reframe done right — built from HIS numbers, not your hypotheticals. You quantified the hidden cost of volunteer labor (making the current state gap visible, per Gap Selling), then anchored the comparison: $9,000 net with 100 hours of pain vs. $18,000–$23,000 net with 3 hours. The math does the selling. His logical brain can't argue with his own data.",
          principle: "Gap Selling (Keenan): the bigger the gap between current state and future state, the bigger the motivation to change. You just made the gap concrete with his own numbers. And per Hormozi: emotion gets someone to lower their action threshold; logic makes the decision stick. You're selling with logic now — and it's devastating because it's built from his data, not yours."
        },
        { text: "80 to 100 hours — that's a massive commitment from your PTA. And that $11,000, after you factor in the donated time and the stress on your team... does that feel like a sustainable model going forward?",
          next: "b3", scores: { empathy: 3, discovery: 2, framing: 1, momentum: 0 }, rating: "okay",
          feedback: "Good empathy — you're labeling the cost of the current state. But this is a classic Implication question without the Need-Payoff follow-up. You've made him feel the problem; now he needs to see the solution. An analytical buyer who sits too long in the pain gets frustrated — he wants the comparison. You had the data to deliver it.",
          principle: "SPIN Selling timing: Implication questions (making the problem feel bigger) must be followed by Need-Payoff questions (helping the buyer envision the solution). Lingering in the Implication phase with an analytical buyer reads as stalling. He gave you the data — use it."
        },
        { text: "That's exactly why schools love Apex — we handle all of that. Your PTA literally just has to say yes, and our team does the rest for two full weeks. No distribution nights, no chasing payments, no volunteer burnout.",
          next: "b3", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "poor",
          feedback: "He gave you $11,000 and 100 hours — specific, concrete data — and you responded with a generic 'we handle everything' pitch. An analytical buyer just handed you the ingredients for a devastating financial comparison, and you ignored them in favor of a features statement. This was your moment to do the math on HIS whiteboard.",
          principle: "Rackham found that the best salespeople talk least when they're closest to the sale — but that doesn't mean going silent. It means being precise. He gave you numbers. Give him numbers back. Features statements ('we handle everything') are the weakest form of persuasion in SPIN research."
        }
      ]
    },
    b2: {
      speaker: "them", name: "Mr. Torres",
      text: "Okay, that breakdown helps. I didn't realize half of it goes directly back to the students. But my treasurer is still going to compare the raw percentage to a 90%-take-home option she saw online. How do I handle that?",
      options: [
        { text: "Let her compare — that's the right instinct. But here's the question I'd want her to sit with: 90% of what? Can I ask what Oak Ridge raised with your last fundraiser? I want to build the comparison from your real numbers, not mine.",
          next: "a2", scores: { empathy: 2, discovery: 3, framing: 2, momentum: 1 }, rating: "excellent",
          feedback: "You validated the treasurer's diligence, planted the Challenger reframe ('90% of what?'), and pivoted to discovery. Once you have his actual numbers, you can build a personalized comparison that's impossible to argue with. This is education-based selling (Holmes): you're teaching, not pitching.",
          principle: "Challenger Sale: the insight '90% of what?' is a genuine teaching moment that reframes how the treasurer evaluates options. Combined with his real data, this becomes what Dixon & Adamson call 'constructive tension' — you're not agreeing with the 90% frame, but you're challenging it with respect and evidence."
        },
        { text: "What if I put together a one-pager for the meeting? I can break down the investment, show net dollar scenarios at different fundraising levels, and include what comparable schools across our network have experienced. Would that be useful?",
          next: "a3", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
          feedback: "The one-pager offer is solid — you're equipping your champion. But it would land better after you've gotten his current numbers. A personalized tool ('Oak Ridge raised $11K last year — here's what that becomes with Apex') converts at a completely different rate than a generic one.",
          principle: "Challenger Customer: champions need tailored ammunition for each stakeholder. Generic tools get filed. Personalized tools get forwarded."
        },
        { text: "Honestly, once the event happens and the check arrives, nobody thinks about the percentage anymore. The experience and the money speak for themselves. And honestly, the whole thing is completely turnkey on your end — we handle the assembly, the lessons, the prizes, everything.",
          next: "c2", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
          feedback: "He asked for a specific counter-argument and you gave him 'trust me.' A treasurer who sees 48% in a spreadsheet is not going to be persuaded by 'nobody thinks about it.' You're asking an analytical person to be emotional. Meet them where they are.",
          principle: "Pink's Attunement: match your approach to the person in front of you. A data-driven treasurer needs data-driven answers. Asking them to 'feel it' instead of 'see it' is a mismatch that reads as evasion."
        }
      ]
    },
    b3: {
      speaker: "them", name: "Mr. Torres",
      text: "It's... look, it works. I'm not going to pretend it's ideal. But it's what we know. Changing to something new is a risk, and my PTA is already stretched thin.",
      options: [
        { text: "That's exactly the tension — changing feels risky even when the current situation is costly. Would it help if I put those numbers on a one-page comparison your treasurer could actually look at?",
          next: "a3", scores: { empathy: 2, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
          feedback: "You named the status quo bias ('changing feels risky even when the current situation is costly') — that's a label from Voss that acknowledges the real psychological barrier. Then you delivered the net-dollars comparison built from HIS data, ending with a tangible next step. The one-pager will do your selling in the room you won't be in.",
          principle: "Status Quo Bias (Kahneman): every prospect is biased toward doing nothing. The way to overcome it is not to argue that they should change — it's to make the cost of NOT changing so concrete that inertia becomes the riskier choice. You just did that with his own numbers."
        },
        { text: "I understand that feeling. Change always feels like a risk. What if we took the pressure off? I can connect you with a principal at a similar-sized school who had the same concern and has now done Apex three years running.",
          next: "a4", scores: { empathy: 2, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
          feedback: "The peer reference is solid social proof (Cialdini), and you acknowledged the emotional barrier. But you had his data — $11K, 100 hours — and didn't use it for the comparison. The peer reference works better AFTER the math. He's a numbers guy; give him numbers, then let the peer confirm them.",
          principle: "Social proof is confirmation, not persuasion — at least for analytical buyers. The math convinces his logical brain; the peer reference calms his emotional brain. Sequence matters: logic first, social proof second."
        },
        { text: "What if I could guarantee you'd raise more with Apex? I'm that confident in the model. Once you see event day, you'll understand why schools stay with us year after year.",
          next: "c2", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
          feedback: "Guarantees from a salesperson are the cheapest currency. An analytical buyer hears 'guarantee' and thinks 'what are the terms?' You've shifted the conversation from data to promises — exactly the wrong direction with someone who thinks in spreadsheets.",
          principle: "Trust Equation: Credibility is built through specifics and honesty, not through guarantees. A guarantee without data feels like confidence covering for a lack of evidence. Show the math, don't promise the outcome."
        }
      ]
    },
    a3: {
      speaker: "them", name: "Mr. Torres",
      text: "That comparison would be really helpful, actually. If you could put real numbers on it — not just a marketing piece — I could share that with the treasurer before the PTA meeting.",
      options: [
        { text: "I'll build it from your actual data — $11,000 raised, roughly 100 volunteer hours, and the catalog model's costs. One more thing: when your treasurer looks at this, what do you think her biggest pushback will be?",
          next: "a4", scores: { empathy: 1, discovery: 3, framing: 2, momentum: 3 }, rating: "excellent",
          feedback: "Masterful close to this thread. You committed to a specific deliverable with a specific timeline (tomorrow morning — Reliability in the trust equation), built from HIS data (Credibility), at three scenario levels (shows intellectual honesty, not just the best case). Then the killer move: asking what the treasurer's biggest pushback will be. That's a pre-emptive discovery question that will make your one-pager address objections before they're raised.",
          principle: "Book a Meeting from a Meeting: never leave a conversation without the next step locked and loaded. But more importantly — always ask 'what will their biggest question be?' (Challenger Customer). This tells you exactly what to put in the materials AND gives your champion a preview of the internal conversation they'll need to navigate."
        },
        { text: "I'll get that to you this week. And I'd recommend we set up a 15-minute follow-up after the PTA meeting so I can answer any questions that come up. When does your treasurer usually meet with the board?",
          next: "a4", scores: { empathy: 1, discovery: 1, framing: 1, momentum: 2 }, rating: "okay",
          feedback: "Good — you're booking the next meeting from this one (never leave without a next step). But 'this week' is vague. 'Tomorrow morning' would signal reliability and urgency. And you missed the opportunity to ask about the treasurer's likely pushback, which would have let you tailor the document.",
          principle: "Reliability is demonstrated in specifics: 'by tomorrow morning' > 'this week.' Small commitments kept precisely build the trust foundation for large commitments. Every vague timeline is a missed Reliability signal."
        },
        { text: "Great! I'll also include some testimonials from principals at similar schools. The more info, the better for making the case, right? Our online platform makes the whole thing seamless for parents, too.",
          next: "a4", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "poor",
          feedback: "He asked for a numbers comparison and you offered testimonials. He's not an emotional buyer — he's an analytical one. 'More info' is not better; the RIGHT info is better. A focused one-pager with his numbers will outperform a content dump every time.",
          principle: "Attunement (Pink): match your response to the buyer type. Analytical buyers want math. Emotional buyers want stories. Sending the wrong type doesn't just fail to persuade — it signals you don't understand how they think. And information overload kills deals (Holmes: mastery of a few things, not 4,000 things)."
        }
      ]
    },
    a4: {
      speaker: "them", name: "Mr. Torres",
      text: "She's going to push on whether the fundraising projections are realistic. She'll say, 'Sure, other schools raise that much, but will WE?' That's her style — skeptical until proven otherwise.",
      options: [
        { text: "Smart treasurer. Here's what I'll do: I'll include the range — conservative, typical, and high — based on schools within 20 miles of here with similar enrollment. No cherry-picked outliers. Would that help close the loop?",
          next: "x1", scores: { empathy: 2, discovery: 1, framing: 2, momentum: 3 }, rating: "excellent",
          feedback: "You addressed her exact concern (are these numbers real?) with three trust-building moves: local comparable data (social proof from proximity), intellectual honesty (a range, not a best case), and a peer-to-peer reference with no salesperson present (the ultimate Ghost Product move — you're voluntarily removing yourself from the trust equation). This is how analytical buyers become champions.",
          principle: "Ghost Products (Hormozi): offering to remove yourself from the conversation ('peer to peer, no salesperson in the room') is the sales equivalent of crossing an item off the list. It proves your confidence and eliminates the self-orientation variable from the trust equation. It's counterintuitive — you're giving up control — but it builds more trust than any pitch."
        },
        { text: "Fair enough. I'll make sure the numbers are based on comparable schools — similar size, similar demographics. And I can include a reference or two she could call if she wants to hear it from someone who's been through it.",
          next: "x1", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
          feedback: "Solid — comparable schools and references are the right idea. But 'a reference or two' is vague. The peer-to-peer treasurer conversation would be much stronger — and offering to remove yourself from it would dramatically increase trust.",
          principle: "Specificity signals reliability. 'I can connect her directly with Lincoln Elementary's treasurer' > 'I can include a reference or two.' Names and details build credibility; generalities erode it."
        },
        { text: "Tell her to just wait until she sees the check. Every school I've worked with has been blown away by the results. She'll come around once the money's in the bank.",
          next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
          feedback: "You're asking a skeptical treasurer to take a leap of faith. She's specifically said she wants proof BEFORE committing, and you're offering proof AFTER. That's backwards for every analytical buyer. You had the tools to close this well — local data, peer references, transparent math — and you chose 'trust me' instead.",
          principle: "The Endowment Effect (Kahneman) only works if the prospect can experience something first. 'Wait until you see the check' asks for commitment before experience — the opposite of how you create psychological ownership. Give her something she can hold NOW: data, references, a peer conversation."
        }
      ]
    },
    c2: {
      speaker: "them", name: "Mr. Torres",
      text: "Look, I appreciate the enthusiasm, but I need more than optimism. Send me whatever data you have and I'll review it when I get a chance.",
      options: [
        { text: "You're right — let me be more specific. Can I ask: what did Oak Ridge raise last year, and roughly how much volunteer time went into it? I'd rather build a comparison from your real numbers than from our marketing materials.",
          next: "a2", scores: { empathy: 2, discovery: 3, framing: 1, momentum: 1 }, rating: "excellent",
          feedback: "Good recovery. You owned the gap ('let me be more specific'), then pivoted to discovery using HIS data. 'Your terms, not mine' is a Self-Orientation reducer — it signals you care more about accuracy than about making the sale. This gets you back on track.",
          principle: "When you get called out for being vague, don't defend — get specific. The fastest trust recovery is to say 'you're right' and then demonstrate the specificity they're asking for. Rackham's research shows that the best salespeople recover from missteps by going BACK to discovery, not forward to features."
        },
        { text: "I'll put together a comprehensive packet with everything — the breakdown, testimonials, case studies, videos. I'll have it to you by end of week. Most schools tell us it's the easiest thing on their calendar all year.",
          next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
          feedback: "'When I get a chance' is polite exit language — he's not excited about a content dump. A comprehensive packet from a salesperson goes in the 'maybe later' pile. You needed to re-earn his engagement with a specific question, not bury him in materials.",
          principle: "When someone says 'send me info,' they're saying 'this conversation isn't giving me what I need.' Sending more information doesn't fix a conversation problem — it delays the deal's death. The fix is to change the conversation by asking a better question."
        },
        { text: "Will do. I'll follow up next week after you've had a chance to look through it. Have a great rest of your day! And honestly, the whole thing is completely turnkey on your end — we handle the assembly, the lessons, the prizes, everything.",
          next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
          feedback: "You handed the deal to the inbox graveyard. No specific next step, no discovery, no reason for him to prioritize your email over the 200 others he'll get this week. This conversation is effectively over.",
          principle: "Blount's Follow-Up Philosophy: every touchpoint should add value. 'I'll follow up next week' adds zero value. 'I'll build a comparison from your actual numbers and have it to you by Tuesday at 9 AM' adds specific value. The first gets ignored. The second gets opened."
        }
      ]
    },
      x1: { speaker: "them", name: "Mr. Torres",
        text: "Alright, you have my attention. Walk me through the logistics — what does this actually ask of my teachers and my front office?",
        options: [
          { text: "One decision on your end: you approve the dates. From there, my team takes over — we come in, learn your school, your teachers, your students, and work as an extension of your staff for the full two weeks. Every communication piece comes ready to send, parent emails and social posts included. What would make that easiest for your front office?",
            next: "x2", scores: { empathy: 1, discovery: 2, framing: 1, momentum: 1 }, rating: "excellent",
            feedback: "Specific and concrete: one named ask (approve the dates), a clear picture of what the school never touches, and you handed the conversation back with a question. 'Extension of your staff' answers the real worry — that this becomes their project to manage.",
            principle: "Gap Selling: buyers trust specifics. 'Turnkey' is a claim; 'you approve the dates and every parent email comes ready to send' is evidence." },
          { text: "Honestly, almost nothing — we're known for being the easiest thing on a school's calendar. We take care of the details from start to finish, our platform makes everything seamless for families, and you and your staff mostly just get to enjoy the two weeks with your students.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
            feedback: "Reassuring, but it's all adjectives — easiest, seamless, everything. A skeptical administrator has heard those exact words from every vendor who ever walked in. One concrete detail about what they actually do (and don't do) would have done the convincing for you.",
            principle: "Claims without detail sound like every other pitch. Specificity is what separates confidence from salesmanship." },
          { text: "That's the best part — we take care of absolutely everything. Registration, donations, prize tracking, parent emails, social media content, the event itself, all of it. I can send you our full program guide and a complete feature breakdown tonight so you can see the whole picture for yourself.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They asked what it costs their people, and you answered with a feature dump and homework — a program guide to read. The question behind the question was 'will this burden my staff,' and it went unanswered while you talked about yourself.",
            principle: "Answer the concern, not the keyword. A feature list is your agenda; their workload was theirs." },
        ],
      },
      x2: { speaker: "them", name: "Mr. Torres",
        text: "Okay. I'm not saying yes today. But if we were going to move forward, what would happen next?",
        options: [
          { text: "A 15-minute call next week with you and whoever runs your fundraising — I'll bring a one-page plan with proposed dates and a realistic goal for your school. If it doesn't fit, you've lost 15 minutes and you'll still know exactly what a program here would look like. Does Tuesday or Thursday work better?",
            next: "end_win", scores: { empathy: 1, discovery: 1, framing: 1, momentum: 3 }, rating: "excellent",
            feedback: "A small, concrete, low-risk next step with a built-in choice of times. You made saying yes easier than saying no, and you pulled in the other decision-makers now instead of discovering them three meetings from now.",
            principle: "Momentum lives in specifics: a date, a duration, a deliverable. Vague follow-ups die in inboxes." },
          { text: "I'll email you our information packet and some references from schools in our network, and you can look everything over whenever you have time. I know you've got a lot on your plate, so just reach out whenever you're ready to talk more.", next: "end_mid",
            scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "okay",
            feedback: "Polite and respectful of their time, but you handed the momentum away. 'Reach out when you're ready' means the next step depends entirely on a busy administrator remembering you exist in three weeks. The door stays open — barely.",
            principle: "Never leave a conversation without a next step that has a name and a date on it." },
          { text: "Well, I'll be honest — our calendar fills up fast this time of year, and most schools lock in their week by the end of the month. I'd hate for you to lose your spot to another school, so the sooner we can get something signed, the better for everyone.", next: "end_loss",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They told you they're not saying yes today, and you answered with a pressure close. Manufactured scarcity right after a trust-building conversation undoes the trust — they hear the tactic, not the deadline. The relationship took the hit.",
            principle: "Voss: a forced 'yes' is worthless. Pressure at the close converts a warm maybe into a polite never." },
        ],
      },

    end_win: {
      speaker: "n", text: "", isEnd: true, endType: "win",
      endMessage: "Mr. Torres has three things: your honest math built from his data, a range of scenarios (not just the best case), and a peer-to-peer connection for his skeptical treasurer. You never dodged the 48% — you owned it, broke it down, and reframed it with his own numbers. He's leaving this conversation thinking 'this person was straight with me.' That's how analytical buyers become your strongest champions.",
      summary: "With analytical buyers: be transparent, use THEIR data, show the math at multiple levels, and arm them with tools for the rooms you won't be in. Ghost Product trust: offer to remove yourself from the proof conversation."
    },
    end_mid: {
      speaker: "n", text: "", isEnd: true, endType: "mid",
      endMessage: "You've kept the door open and you're sending useful materials. But the deal would be stronger if you'd gotten Oak Ridge's actual numbers for the comparison, asked about the treasurer's specific pushback, or offered the peer-to-peer connection. Your follow-up will need to fill those gaps.",
      summary: "The foundation is there, but the champion isn't fully armed. Tailor everything to their specific situation and stakeholders before the PTA meeting."
    },
    end_loss: {
      speaker: "n", text: "", isEnd: true, endType: "loss",
      endMessage: "Mr. Torres was interested enough to invite you back — that's rare. But the percentage concern is still unresolved and he has nothing concrete to take to the PTA. Generic materials won't address his specific concern. This deal needs a rescue follow-up: lead with his school's actual data, offer a tailored comparison, and give the treasurer a peer to call.",
      summary: "An analytical buyer who doesn't get analytical answers will find reasons to say no. Never let 'send me info' end a conversation — that's the moment to go deeper, not retreat."
    }
  }
};

/* ════════════════════════════════════════════════════════════════════
   SCENARIO 2: CLASSROOM TIME (Live vs. Flex)
   ════════════════════════════════════════════════════════════════════ */
const S2 = {
  id: "classroom", title: "\"We Can't Give Up Classroom Time\"",
  subtitle: "Heritage Academy — Second Visit with Principal",
  difficulty: "Standard",
  setting: "Dr. Chen runs a high-performing school that's protective of instructional time. She liked you on your first visit but pushed back hard on anything that disrupts teaching. She's agreed to a 15-minute follow-up. Her school is a PBIS school using the Positivity Project. Key insight: Apex has a FLEX program — the school receives video-based leadership lessons they can show anytime, at their pace, keeping full control of their schedule.",
  persona: "Dr. Chen — Academic-first, protective of teachers, data-driven. Cares deeply about school culture but won't sacrifice instruction for it. Respects people who respect her boundaries.",
  teaches: ["Respecting hard boundaries", "PBIS alignment as bridge", "Introducing the Flex program", "Complement vs. compete positioning", "Future pacing school culture"],
  nodes: {
    start: {
      speaker: "them", name: "Dr. Chen",
      text: "Good to see you again. I've been thinking about our conversation. I'll be honest — I like the fundraising piece and the event day sounds incredible. But the classroom time issue is still a non-starter for me. My teachers have pacing guides, intervention blocks, testing windows. I can't have an outside team interrupting that flow, even for five minutes.",
      options: [
        { text: "I completely respect that — and honestly, it tells me a lot about your priorities that instructional time is the line you won't cross. I want to make sure I'm understanding correctly: is the core concern the time itself, or is it more about having unfamiliar people in your classrooms?",
          next: "a1", scores: { empathy: 3, discovery: 3, framing: 0, momentum: 1 }, rating: "excellent",
          feedback: "You validated her boundary, then used a diagnostic question to understand the real objection. This is the Acknowledge → Explore → Respond framework from Voss: before you can respond, you need to know whether this is a time concern or a trust concern. Her answer will tell you whether the Flex program or a different approach is right.",
          principle: "Every objection falls into one of three categories (The Salesperson's Mind): trust deficit, value gap, or logistics problem. 'Can't give up classroom time' could be any of the three. The diagnostic question separates them. A logistics problem has a logistics solution (Flex). A trust problem needs trust-building. Don't offer solutions until you know which category you're in."
        },
        { text: "What if classroom visits were completely optional? We actually have a Flex program where your teachers get video-based leadership lessons they can show at any time that works for them — during morning meeting, a transition period, whenever fits their schedule.",
          next: "b1", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
          feedback: "The Flex program is the right card to play — but you played it before understanding whether time or trust is the real issue. If her concern is trust (unfamiliar people in classrooms), the Flex program solves it perfectly. If her concern is pure time (no character content at all), even Flex might be a tough sell. Ask first, prescribe second.",
          principle: "The Doctor Frame (Hormozi/Miner): prescribing without diagnosing is malpractice. The Flex program is a great prescription — but only for the right diagnosis. One discovery question first would have made this land with 3x the impact."
        },
        { text: "I hear you. What if we just focused on the event day and the fundraising piece? We can customize around your needs completely. Once you see event day, you'll understand why schools stay with us year after year.",
          next: "c1", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
          feedback: "You just conceded Apex's biggest differentiator — the character education component — at the first sign of resistance. Without it, you're a fun run company competing on event quality and price. The Flex program exists precisely for this situation, and you didn't even mention it. Never negotiate away your core value before exploring all options.",
          principle: "Gap Selling: if you remove the character education, the gap between Apex and a DIY fun run narrows dramatically. Your 48% split only makes sense when the value proposition includes leadership curriculum, campus presence, AND the event. Conceding a major value pillar before the buyer asks you to is negotiating against yourself."
        }
      ]
    },
    a1: {
      speaker: "them", name: "Dr. Chen",
      text: "Both, honestly. But if I'm being specific — it's the time. Every minute of instruction matters here. We're a Title I school, our scores are finally trending up, and I won't do anything that jeopardizes that momentum. I trust my teachers with their own classrooms. I just can't ask them to give up time they don't have.",
      options: [
        { text: "That makes perfect sense — and the progress you've built is clearly hard-won. Here's what I want you to know: we actually built a program specifically for schools like Heritage that won't compromise instruction time. It's called our Flex program. Can I tell you how it works?",
          next: "a2", scores: { empathy: 2, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
          feedback: "Perfect timing for the Flex reveal. You empathized with her progress (genuine acknowledgment, not flattery), then introduced the Flex program as built specifically for her situation. 'Schools like Heritage that won't compromise instruction time' frames her objection as a quality she should be proud of, not a barrier to work around. And 'can I tell you how it works?' asks permission — giving her control.",
          principle: "Challenger Sale, done right: you're teaching her about a solution she didn't know existed, tailored to her specific concern. The key phrase is 'we built this specifically for schools like yours' — it transforms an objection into a design requirement. She's not hearing 'we have a workaround.' She's hearing 'we anticipated your exact need.'"
        },
        { text: "I really respect that. Let me ask: outside of classroom time — in the broader school culture — is there anything you wish you could do more of but don't have the bandwidth for? But you know your school better than I do, so I'll follow your lead.",
          next: "b2", scores: { empathy: 3, discovery: 3, framing: 0, momentum: 0 }, rating: "okay",
          feedback: "Beautiful empathy and a great discovery question — you're looking for the gap in school culture that Apex could fill. But you've left the Flex program off the table when it's the exact solution to her exact concern. Sometimes the best move is to present the solution, not keep exploring. She told you the problem clearly; now solve it.",
          principle: "SPIN Selling: there's a moment in every discovery where you have enough information to present. Staying in discovery past that point frustrates analytical buyers who are ready for the prescription. She gave you a clear diagnosis (time, not trust). Prescribe."
        },
        { text: "What if the classroom visits were just two or three times during the two weeks instead of daily? We can be very flexible on the schedule. Our online platform makes the whole thing seamless for parents, too.",
          next: "c1b", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
          feedback: "She said instructional time is a non-starter and you're still negotiating the number of classroom visits. You're pushing against a wall that has a door right next to it. The Flex program IS that door — and you're ignoring it to bang on the wall.",
          principle: "When someone draws a firm boundary, don't negotiate within it — find an alternative that respects it entirely. The Flex program eliminates classroom time concerns completely. Offering 'fewer visits' when 'zero visits' is available makes you look tone-deaf."
        }
      ]
    },
    b1: {
      speaker: "them", name: "Dr. Chen",
      text: "That's... actually interesting. The teachers control when to show them? They're not live visits?",
      options: [
        { text: "Exactly — they're pre-recorded leadership lessons your teachers can show whenever it naturally fits their day. Some teachers use them during morning meetings, some during transitions, some as a brain break before testing. Does that change the picture for you?",
          next: "a2", scores: { empathy: 1, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
          feedback: "Clean, specific explanation that addresses every dimension of her concern: teachers control timing, content fits naturally into existing routines, and Apex's campus presence is outside of classrooms. Ending with 'does that change the picture?' is a trial close that checks her temperature without pressure.",
          principle: "Need-Payoff framing (SPIN): instead of listing features of Flex, you described what it makes possible for HER school. 'Your team decides' / 'on your schedule, not ours' — every phrase puts control in her hands. With protective principals, perceived control is the key to unlocking the yes."
        },
        { text: "Right! It's our Flex program. The videos are PBIS-aligned and tied to the Apex Superheroes theme — each lesson focuses on a character trait like being Steady, being an Uplifter, going the Extra Mile.",
          next: "a2", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
          feedback: "Good information — PBIS alignment and connecting to her existing framework. But you launched into program details before checking whether the core concern (teacher control over timing) has been resolved. Answer her question first ('yes, teachers control everything'), THEN layer in the PBIS connection.",
          principle: "Answer the question that was asked, THEN add your framing. She asked 'teachers control when to show them?' — that's a yes/no with context. Leading with program theme details before confirming the control issue makes it feel like you're pivoting to a pitch instead of addressing her concern."
        },
        { text: "Yes! And it's really easy — they just press play. It takes almost no effort on the teacher's part. Want me to show you a sample? I'm happy to share details whenever it's useful for you.",
          next: "a2", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
          feedback: "'They just press play' undersells the program and might make it sound low-quality to an academic-first principal. She cares about substance, not ease. Lead with the educational quality and PBIS alignment, not the simplicity.",
          principle: "Attunement (Pink): match your pitch to what the buyer values. An overwhelmed PTA president wants to hear 'easy.' An academic-first principal wants to hear 'rigorous' and 'aligned.' Same product, different emphasis."
        }
      ]
    },
    a2: {
      speaker: "them", name: "Dr. Chen",
      text: "That does change things. If teachers have full control, that addresses my biggest concern. But I want to be realistic — is the experience as strong without the live classroom visits? I don't want a watered-down version.",
      options: [
        { text: "That's a fair question, and I'll be honest with you: the live program is our flagship, and the in-classroom energy is special. Would it help if I showed you a sample lesson so you can judge the quality yourself?",
          next: "a3", scores: { empathy: 1, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
          feedback: "This is the Ghost Product move applied brilliantly. You were honest that the live program has a different energy ('I'll be honest: the live program is our flagship') — which builds trust by sacrificing a small amount of sales positioning. Then you reframed Flex as purpose-built for schools like hers, not a downgrade. And the sample lesson offer creates the Endowment Effect: once she sees it, she'll start to feel ownership of the program.",
          principle: "Ghost Products (Hormozi): when you acknowledge that something else might be stronger in one dimension, you build trust in everything else you say. 'The live classroom energy is special, but Flex was built for a different purpose' is more credible than 'Flex is just as good.' Honesty about tradeoffs is the ultimate trust accelerator."
        },
        { text: "Absolutely — the videos are high quality. They were developed with over 600 educators and they're fully PBIS-aligned. Your teachers will love them. And everything else stays the same — pep rally, recess engagement, event day, all of it.",
          next: "a3", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
          feedback: "Accurate but too enthusiastic for someone who asked 'is this watered down?' She's testing your honesty — and 'absolutely, it's great!' doesn't pass the test as well as a nuanced answer would. An academic-first principal respects intellectual honesty more than sales confidence.",
          principle: "Arete / Virtue (Aristotle via The Salesperson's Mind): being honest about limitations — even small ones — builds trust disproportionately. A salesperson who only validates is a yes-person. A salesperson who gives a nuanced, honest comparison is a trusted advisor."
        },
        { text: "Great question. What if you tried the Flex program for one cycle and we could always upgrade to the live program the next year once you've seen how it works? Low risk for you.",
          next: "a3", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
          feedback: "The 'try it and upgrade' offer is fine, but it positions Flex as the inferior option — which contradicts the framing you should be building. Flex isn't a starter package; it's a purpose-built solution for academically rigorous schools. Don't frame it as a stepping stone.",
          principle: "Framing matters: 'try Flex now, upgrade to live later' tells her Flex is the lesser version. 'Flex was designed for schools like yours that prioritize instruction' tells her it's the smart choice. Same offer, completely different psychology."
        }
      ]
    },
    b2: {
      speaker: "them", name: "Dr. Chen",
      text: "School culture, honestly. We do monthly assemblies and a spring field day, but getting 600 kids excited about the same thing at the same time is really hard. And the events we run are huge lifts for my staff.",
      options: [
        { text: "That's one of the hardest things in a school — building that shared, school-wide moment. That's actually where Apex lives. Would it be worth 15 minutes for me to walk you through what that looks like specifically for Heritage?",
          next: "a3", scores: { empathy: 2, discovery: 0, framing: 3, momentum: 3 }, rating: "excellent",
          feedback: "You connected Apex's value directly to a gap SHE identified (school-wide culture) and introduced the Flex program as the solution to her classroom concern — all in one natural flow. The micro-commitment ask (15 minutes) is specific and small enough that she'll say yes.",
          principle: "Gap Selling: she described the gap herself ('getting 600 kids excited about the same thing is really hard'). Your job is to position Apex as the bridge across that gap. When the prospect identifies the gap and you fill it with your value, resistance evaporates."
        },
        { text: "Apex solves exactly that. We build two weeks of school-wide energy culminating in a huge event day — and your staff doesn't lift a finger. Plus, we have a way to deliver the character education piece without touching your classroom time.",
          next: "a2", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
          feedback: "Right direction but too vague on the Flex piece. 'A way to deliver character education without touching classroom time' — she's going to want specifics. Lead with the Flex description so she understands what it actually is.",
          principle: "Clarity (Pink): the most valuable thing you can do is not provide more information but provide clarity. Vague references to solutions frustrate buyers who need specifics to evaluate."
        },
        { text: "That's a big gap. And with your staff carrying the load on events, no wonder they're stretched. What if there was a turnkey solution that handled all of it? Most schools tell us it's the easiest thing on their calendar all year.",
          next: "a2", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 0 }, rating: "poor",
          feedback: "Generic 'what if' pitch. She just told you exactly what she needs and you responded with a vague teaser. When someone gives you their buying condition, meet it with specifics — not mystery.",
          principle: "When a prospect gives you their buying condition ('I need school-wide culture without instructional disruption'), match it immediately with a specific solution. Vague teasers waste the opening."
        }
      ]
    },
    c1: {
      speaker: "them", name: "Dr. Chen",
      text: "I'd consider that. But if it's just an event day and fundraising... I can get any company to do a fun run. What makes yours worth the higher split?",
      options: [
        { text: "That's a fair challenge — and you're right that just an event day doesn't justify the investment. Can I take a step back? That's what makes Apex different from 'just a fun run.' Can I explain how it works?",
          next: "a2", scores: { empathy: 2, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
          feedback: "Honest recovery. You admitted you conceded too fast ('I jumped too fast') and brought the Flex program back in a way that addresses her boundary completely. Owning a mistake builds more credibility than pretending it didn't happen. She'll respect the transparency.",
          principle: "Vulnerability as trust-builder: admitting 'I jumped too fast' is a form of Hormozi's shoulder-to-shoulder move. You're not a perfect sales robot; you're a human recalibrating in real time. That honesty is a Credibility signal in the Trust Equation."
        },
        { text: "What if I could show you what the event day looks like? I think once you see the production quality and the student energy, you'll see the difference. Can I send you a 60-second video?",
          next: "c1b", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
          feedback: "The video is fine but you're selling the event in isolation when the Flex program would reestablish the full value proposition. You're competing on event quality alone — a much weaker position than 'character education + turnkey fundraising + professional event.'",
          principle: "Never compete on a single dimension when you have a multi-dimensional value proposition. Every removed pillar weakens your justification for the 48% split."
        },
        { text: "Our events are a premium production — trained team, professional equipment, music, themed t-shirts, the whole experience. Schools typically raise $35K-$50K with a 98% collection rate. And honestly, the whole thing is completely turnkey on your end — we handle the assembly, the lessons, the prizes, everything.",
          next: "c1b", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 0 }, rating: "poor",
          feedback: "Features dump to an academic-first principal. She asked 'what makes you worth it?' and you listed production specs and dollar figures. She values alignment, quality, and school culture — not equipment and collection rates.",
          principle: "Attunement (Pink): she's not buying a production. She's buying a partner who understands her school's values. Match the message to the buyer."
        }
      ]
    },
    c1b: {
      speaker: "them", name: "Dr. Chen",
      text: "Send me the video. I'll watch it. But I have to be honest — without the character education component, I'm not sure how this is different from any other fun run company.",
      options: [
        { text: "You know what — you just said the exact thing I should have led with. We actually DO have the character education piece for schools like yours. Can I tell you how it works?",
          next: "a2", scores: { empathy: 2, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
          feedback: "Raw honesty saves the conversation. 'I overcorrected' is disarming because salespeople never admit to strategy errors. You've restored the full value proposition and framed the Flex program as the bridge between what she wants (character education) and what she needs (protected instruction time).",
          principle: "Constructive tension (Challenger Sale): you're gently challenging her frame ('without character ed, what's different?') by revealing something she didn't know existed. And the honesty about overcorrecting builds trust faster than a smooth pivot would."
        },
        { text: "Fair point. Let me put together a full overview of what makes the Apex experience different — the team, the energy, the student impact — and I'll send it along with the video. I think the whole picture will be compelling.",
          next: "x1", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
          feedback: "She's telling you she needs something beyond a fun run, and you're offering more marketing materials about the fun run. The Flex program is sitting right there, solving her exact concern, and you're not using it. This is like having the answer key and not looking at it.",
          principle: "When you have a solution that directly addresses the stated objection, present it. Don't substitute materials for a conversation that needs to happen now."
        },
        { text: "Understood. I'll include the video and some info on the character education side too. Maybe we can revisit that piece if you're open to it in our network.",
          next: "x1", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "okay",
          feedback: "'Revisit in our network' kicks the value proposition further away instead of solving it now. The Flex program is the answer to 'how is this different?' — and you're deferring it indefinitely.",
          principle: "Don't defer solutions. If you have an answer to their objection, deliver it. 'Maybe in our network' communicates uncertainty about your own product."
        }
      ]
    },
    a3: {
      speaker: "them", name: "Dr. Chen",
      text: "That's... I have to say, I didn't know that option existed. The Positivity Project is already in our morning meetings — if these videos are PBIS-aligned, my teachers could literally drop them into the same block without changing anything.",
      options: [
        { text: "Exactly — it's designed to complement what you're already doing, not compete with it. Your Positivity Project gives students the foundation. The Apex Superheroes theme brings it to life in a school-wide experience they'll remember. Does that work?",
          next: "a4", scores: { empathy: 1, discovery: 0, framing: 3, momentum: 3 }, rating: "excellent",
          feedback: "You positioned Apex as a complement ('bring it to life school-wide'), connected the specific theme to her specific framework (PBIS), and closed with a dual-commitment: the Endowment Effect (sample lesson creates ownership) plus an honesty signal ('if it doesn't meet your standard, I'll tell you'). That last line is the Hormozi 'I want you to decide, not buy' frame — and it's the most powerful closer for protective principals.",
          principle: "Endowment Effect (Kahneman): once she watches the sample lesson and imagines her teachers using it, she'll start to feel ownership of the program. And 'I'll tell you if it's not a fit' reduces self-orientation to near zero in the Trust Equation. She's not being sold to — she's being consulted."
        },
        { text: "That's exactly the idea. Our curriculum was developed with input from over 600 educators — it's substantive, not fluff. Want me to send you a sample so your team can review it?",
          next: "a4", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 2 }, rating: "okay",
          feedback: "Good — sample lesson creates the Endowment Effect. But you missed the chance to connect the specific Apex theme to her specific PBIS framework. That level of tailoring is what separates 'interesting' from 'this was made for us.'",
          principle: "Tailoring (Challenger Sale): generic quality claims are less compelling than specific alignment claims. '600 educators' is impressive. 'The Superheroes traits map directly to your Positivity Project language' is compelling."
        },
        { text: "Great! Let me set up a pre-meeting with you and your team to walk through the whole program. When works this month? Once you see event day, you'll understand why schools stay with us year after year.",
          next: "a4", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 2 }, rating: "poor",
          feedback: "Too fast. She said she didn't know Flex existed two minutes ago and you're already asking for a team meeting. She needs to evaluate the content quality first — that's her gatekeeping criterion. Send the sample, let her judge, THEN schedule the meeting. Overasking kills momentum with protective principals.",
          principle: "Match your ask to their readiness (Commitment Ladder). She's at 'this is interesting' — not 'I'm ready to commit.' A sample lesson is the right next step; a team meeting is two steps ahead. Overasking doesn't speed things up — it creates resistance."
        }
      ]
    },
    a4: {
      speaker: "them", name: "Dr. Chen",
      text: "Send me the sample. If the quality is there, I'll share it with my leadership team. And yes — if it meets our standard, let's talk about the pre-meeting.",
      options: [
        { text: "I'll have it in your inbox by tomorrow morning. And Dr. Chen — I want to ask one thing: when your leadership team looks at it, what specifically will they be evaluating? If I know their criteria, I can make sure the sample addresses what matters most to them.",
          next: "x1", scores: { empathy: 1, discovery: 3, framing: 1, momentum: 3 }, rating: "excellent",
          feedback: "Specific timeline (tomorrow morning = Reliability), and then the champion-arming question: what will the leadership team care about? This is the pre-emptive discovery question that makes your follow-up devastatingly targeted. Her answer becomes the framework for every subsequent interaction.",
          principle: "The Challenger Customer: the sale is won or lost in the rooms you're not in. Asking 'what will your team evaluate?' prepares you to address their criteria proactively. And the specific delivery timeline builds Reliability — the trust variable that compounds fastest."
        },
        { text: "Will do. I'll send the sample lesson and the Superheroes theme overview. Looking forward to hearing what your team thinks! Either way, it has to be the right fit for your staff and your students. There's no pressure on my end at all.",
          next: "x1", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
          feedback: "Fine, but you missed the discovery question about what the leadership team will care about. Your follow-up will be a shot in the dark instead of a targeted message. Always ask what the next audience will evaluate.",
          principle: "Every conversation with a champion should end with: 'What will the next person's biggest question be?' That answer is worth more than any marketing material."
        },
        { text: "Perfect! I'm really excited for you to see it. Your school is going to love this. Have a great rest of your day! Our online platform makes the whole thing seamless for parents, too. Most schools tell us it's the easiest thing on their calendar all year.",
          next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
          feedback: "'Your school is going to love this' is presumptuous for a principal who hasn't evaluated the content yet. She's cautious and evidence-based — telling her she'll love it before she's seen it undermines the credibility you've built.",
          principle: "Never tell someone how they'll feel about something they haven't experienced. Let the product speak. With academic-first buyers, overclaiming is worse than underclaiming."
        }
      ]
    },
      x1: { speaker: "them", name: "Dr. Chen",
        text: "Alright, you have my attention. Walk me through the logistics — what does this actually ask of my teachers and my front office?",
        options: [
          { text: "One decision on your end: you approve the dates. From there, my team takes over — we come in, learn your school, your teachers, your students, and work as an extension of your staff for the full two weeks. Every communication piece comes ready to send, parent emails and social posts included. What would make that easiest for your front office?",
            next: "x2", scores: { empathy: 1, discovery: 2, framing: 1, momentum: 1 }, rating: "excellent",
            feedback: "Specific and concrete: one named ask (approve the dates), a clear picture of what the school never touches, and you handed the conversation back with a question. 'Extension of your staff' answers the real worry — that this becomes their project to manage.",
            principle: "Gap Selling: buyers trust specifics. 'Turnkey' is a claim; 'you approve the dates and every parent email comes ready to send' is evidence." },
          { text: "Honestly, almost nothing — we're known for being the easiest thing on a school's calendar. We take care of the details from start to finish, our platform makes everything seamless for families, and you and your staff mostly just get to enjoy the two weeks with your students.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
            feedback: "Reassuring, but it's all adjectives — easiest, seamless, everything. A skeptical administrator has heard those exact words from every vendor who ever walked in. One concrete detail about what they actually do (and don't do) would have done the convincing for you.",
            principle: "Claims without detail sound like every other pitch. Specificity is what separates confidence from salesmanship." },
          { text: "That's the best part — we take care of absolutely everything. Registration, donations, prize tracking, parent emails, social media content, the event itself, all of it. I can send you our full program guide and a complete feature breakdown tonight so you can see the whole picture for yourself.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They asked what it costs their people, and you answered with a feature dump and homework — a program guide to read. The question behind the question was 'will this burden my staff,' and it went unanswered while you talked about yourself.",
            principle: "Answer the concern, not the keyword. A feature list is your agenda; their workload was theirs." },
        ],
      },
      x2: { speaker: "them", name: "Dr. Chen",
        text: "Okay. I'm not saying yes today. But if we were going to move forward, what would happen next?",
        options: [
          { text: "A 15-minute call next week with you and whoever runs your fundraising — I'll bring a one-page plan with proposed dates and a realistic goal for your school. If it doesn't fit, you've lost 15 minutes and you'll still know exactly what a program here would look like. Does Tuesday or Thursday work better?",
            next: "end_win", scores: { empathy: 1, discovery: 1, framing: 1, momentum: 3 }, rating: "excellent",
            feedback: "A small, concrete, low-risk next step with a built-in choice of times. You made saying yes easier than saying no, and you pulled in the other decision-makers now instead of discovering them three meetings from now.",
            principle: "Momentum lives in specifics: a date, a duration, a deliverable. Vague follow-ups die in inboxes." },
          { text: "I'll email you our information packet and some references from schools in our network, and you can look everything over whenever you have time. I know you've got a lot on your plate, so just reach out whenever you're ready to talk more.", next: "end_mid",
            scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "okay",
            feedback: "Polite and respectful of their time, but you handed the momentum away. 'Reach out when you're ready' means the next step depends entirely on a busy administrator remembering you exist in three weeks. The door stays open — barely.",
            principle: "Never leave a conversation without a next step that has a name and a date on it." },
          { text: "Well, I'll be honest — our calendar fills up fast this time of year, and most schools lock in their week by the end of the month. I'd hate for you to lose your spot to another school, so the sooner we can get something signed, the better for everyone.", next: "end_loss",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They told you they're not saying yes today, and you answered with a pressure close. Manufactured scarcity right after a trust-building conversation undoes the trust — they hear the tactic, not the deadline. The relationship took the hit.",
            principle: "Voss: a forced 'yes' is worthless. Pressure at the close converts a warm maybe into a polite never." },
        ],
      },

    end_win: {
      speaker: "n", text: "", isEnd: true, endType: "win",
      endMessage: "Dr. Chen went from 'classroom time is a non-starter' to requesting a sample lesson for her leadership team. You did this by diagnosing the real concern (time, not trust), introducing the Flex program as purpose-built for her situation, being honest about tradeoffs, and asking what her team will evaluate. The sample creates the Endowment Effect, and your follow-up will be targeted to her team's criteria.",
      summary: "When a principal draws a hard boundary on classroom time, don't push against it — present the Flex program as a solution designed for schools with their priorities. Diagnose first, prescribe second, and always ask what the next audience will evaluate."
    },
    end_mid: {
      speaker: "n", text: "", isEnd: true, endType: "mid",
      endMessage: "You've earned a next step — the sample lesson is going out. But you missed opportunities to tailor (connecting the Apex theme to her PBIS framework) or to prepare for the leadership team's evaluation criteria. Your follow-up will need to fill those gaps.",
      summary: "The door is open but the deal isn't closed. Tailor your materials to her specific framework and find out what her team cares about before the next conversation."
    },
    end_loss: {
      speaker: "n", text: "", isEnd: true, endType: "loss",
      endMessage: "The Flex program was the answer to her exact objection, and it never came up — or it came up too late without enough context. Without the character education component, Apex becomes 'just another fun run' in her eyes, and the 48% split becomes impossible to justify. Next time, diagnose the objection's root cause, then lead with Flex.",
      summary: "Never concede your core differentiator before exploring all options. The Flex program exists precisely for classroom-time objections — use it."
    }
  }
};

/* ════════════════════════════════════════════════════════════════════
   REMAINING SCENARIOS — Condensed node structure for file size
   ════════════════════════════════════════════════════════════════════ */

const makeScenario = (id, title, subtitle, difficulty, setting, persona, teaches, nodes) =>
  ({ id, title, subtitle, difficulty, setting, persona, teaches, nodes });

const S3 = makeScenario(
  "outside", "\"We Don't Allow Outside Organizations\"", "Pinewood Elementary — Cold Drop-By", "Standard",
  "Mrs. Gutierrez is a veteran principal (18 years) who runs a tight ship. Her school had a bad experience with an outside vendor three years ago — team was unprofessional, ran over schedule, teachers were upset. Since then, her policy is 'no outside organizations.' The front office staff likes you (you've been bringing thoughtful gifts for weeks), and they flagged she might be open to a quick hello between meetings.",
  "Mrs. Gutierrez — Direct, protective, burned by a competitor. Fiercely loyal to her teachers. Uses straight talk and expects it in return. If you earn her trust, she becomes a wall for you, not against you.",
  ["Don't badmouth competitors", "Ask about the bad experience", "Local franchise credibility", "Earning the right to come back", "Patience as strategy"],
  {
    start: { speaker: "them", name: "Mrs. Gutierrez", text: "My office manager says you've been persistent — in a good way, she says. I'll give you two minutes but I'll be upfront: we don't work with outside organizations anymore. We had a bad experience and I'm not looking to repeat it.", options: [
      { text: "I appreciate the two minutes and I respect that policy. Before I say anything about what I do — can I ask what happened? I'd rather understand your experience than pitch over it.", next: "a1", scores: { empathy: 3, discovery: 3, framing: 0, momentum: 0 }, rating: "excellent",
        feedback: "You put her experience ahead of your pitch. This is tactical empathy at its finest — you're not trying to overcome her objection, you're trying to understand it. By asking 'what happened?' you're collecting intelligence (what went wrong becomes your differentiation map) AND building trust (you're the first vendor who asked instead of argued).",
        principle: "The Iceberg Model (Salesperson's Mind): her 'no outside organizations' policy is the tip. Underneath is a specific bad experience with specific failures. Your job is to understand the iceberg before offering solutions. The more of it you see, the more precisely you can differentiate." },
      { text: "I totally understand. I'm actually different from most programs — I'm a local franchise owner, I live right here in the community, and I'll be your single point of contact from kickoff to wrap-up. Can I tell you about what we do?", next: "b1", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "The local credibility is your strongest differentiator — but you deployed it before understanding what went wrong. If the bad experience was about professionalism, 'I'm local' doesn't address it. If it was about accountability, 'I'm local' is perfect. Ask first, differentiate second.",
        principle: "The Doctor Frame: prescribing before diagnosing. You have a good prescription (local, personal, accountable) but you don't know the disease yet. Her bad experience could have been about schedule disruption, unprofessionalism, poor results, or something else entirely." },
      { text: "I hear that. What if I just left you a one-pager and followed up in a couple weeks? And honestly, the whole thing is completely turnkey on your end — we handle the assembly, the lessons, the prizes, everything.", next: "x1", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "She gave you two minutes and you used 10 seconds of them. The one-pager goes in a drawer, the follow-up goes to voicemail. You had a rare audience with a closed-door principal and you retreated at the first sign of resistance. This was your moment to be curious, not cautious.",
        principle: "Blount's Fanatical Prospecting: an empty pipeline comes from not asking enough questions, not from too many rejections. You didn't get rejected here — you rejected yourself. Stay curious, not cautious." }
    ]},
    a1: { speaker: "them", name: "Mrs. Gutierrez", text: "They promised it would be turnkey. But their team showed up late on day one, they were loud during instruction, they ran the pep rally 20 minutes over, and by event day two of the three team members didn't show. I had parents volunteering to fill in. It was embarrassing.", options: [
      { text: "That's unacceptable — and I'm frustrated on your behalf. You trusted them with your school and they didn't respect it. Let me make sure I'm hearing this right: the core issue was accountability. Is that fair?", next: "a2", scores: { empathy: 3, discovery: 2, framing: 1, momentum: 1 }, rating: "excellent",
        feedback: "You expressed genuine frustration (not scripted sympathy), then used a Voss label — 'the core issue was accountability' — to name what happened in values language. You're not summarizing the logistics; you're naming the principle that was violated. If she says 'that's right,' you've earned the right to address it.",
        principle: "Getting to 'That's Right' (Voss): when someone feels truly understood — not just heard, but understood at the level of what it MEANT to them — their defenses drop. 'The core issue was accountability' is a label that, if accurate, will produce a 'that's right.' And 'that's right' is the bridge to the solution conversation." },
      { text: "That sounds terrible. I'm sorry you went through that. Our team is very different — our team members are trained professionals, and you'll have me as your direct point of contact the entire time. Want me to tell you how we handle things differently?", next: "a2b", scores: { empathy: 2, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
        feedback: "The empathy is genuine, but jumping to 'we're different' before she's finished processing the bad experience feels rushed. She shared something that clearly still bothers her — sit with it a moment longer before pivoting to your solution.",
        principle: "Silence after a meaningful disclosure (Salesperson's Mind): the things people say into silence are more honest than the things they say in fast conversation. A two-second pause here would have been more powerful than an immediate pivot to your pitch." },
      { text: "Was that Boosterthon? I've heard similar stories from other schools. Once you see event day, you'll understand why schools stay with us year after year. Our online platform makes the whole thing seamless for parents, too.", next: "b1b", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "Never ask who the competitor was and never imply their problems are well-known. Even if it WAS Boosterthon, saying 'I've heard similar stories' is competitor-bashing disguised as empathy. It makes you look competitive instead of curious.",
        principle: "Carnegie: never criticize, condemn, or complain — especially about competitors. Your value proposition must stand on its own. Taking shots at a competitor makes you look insecure and competitive, not confident and differentiated." }
    ]},
    a2: { speaker: "them", name: "Mrs. Gutierrez", text: "That's exactly right. They didn't respect my building. And after that, I told the district: no more outside programs. Period.", options: [
      { text: "I understand why you drew that line. Can I tell you specifically how I'm structured differently from what you experienced — and then you can decide if it's worth a longer conversation? If it's not, I'll respect that completely.", next: "a3", scores: { empathy: 2, discovery: 0, framing: 2, momentum: 2 }, rating: "excellent",
        feedback: "Accusation Audit (Voss): by saying 'if it's not worth it, I'll respect that,' you've defused the pressure she's expecting. She's bracing for a pitch and you gave her an exit door. Paradoxically, the exit door makes her more willing to listen — because she feels in control.",
        principle: "The Power of 'No' (Voss): when people feel safe saying no, they become more open to hearing yes. 'You can decide if it's worth a longer conversation' gives her veto power — which makes her more likely to grant the audience." },
      { text: "Makes sense. What if I came back for a proper meeting when you have more time — 15 minutes, no pressure — and I could walk you through exactly how we handle accountability?", next: "a3b", scores: { empathy: 2, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
        feedback: "Respectful ask, but you're deferring the value delivery. She's in front of you RIGHT NOW. You have her attention. Use the remaining seconds to differentiate, then ask for the next meeting. Don't waste the audience you've earned.",
        principle: "Be brief, be bright, be gone (Blount) — but 'be brief' means deliver value quickly, not defer it. She gave you time. Use it." },
      { text: "I completely understand. Would it help if I connected you with a principal at another school who had a similar concern and has been with us for three years? But you know your school better than I do, so I'll follow your lead.", next: "a3b", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
        feedback: "Good social proof offer, but premature. She hasn't heard how you're different yet. References reinforce — they don't replace. Answer her accountability concern first, then offer the reference as confirmation.",
        principle: "Social proof is confirmation, not introduction. Answer the concern yourself first. References are strongest when they confirm what you've already said, not when they substitute for saying it." }
    ]},
    a2b: { speaker: "them", name: "Mrs. Gutierrez", text: "I've heard 'we're different' before. Everyone says that. What specifically would be different?", options: [
      { text: "Fair. Here's what's specific: I'm a franchise owner. I live in [community], my kids go to school in this district, and I'm your dedicated point of contact for every step, from planning through the final deposit.", next: "a3", scores: { empathy: 0, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
        feedback: "You addressed every specific failure point from her bad experience: team not showing up → same team day one to day ten. Running over schedule → pre-meeting with campus walk. No accountability → you're local, you're personal, they call you directly. This isn't a pitch — it's a point-by-point answer to HER problems.",
        principle: "When you've done the discovery work, the pitch writes itself. Every feature you mentioned directly addressed something SHE told you went wrong. That's why discovery comes first — it turns your pitch from generic to surgical." },
      { text: "I'm a local franchise owner — not a corporate team. I live right here, and you'd have me as your direct point of contact throughout. And our team is trained extensively before they ever step on campus.", next: "a3", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "Good differentiators but less specific than they could be. 'Trained extensively' is vague — what does that mean to HER? Connecting each point to her specific bad experience would make these hit much harder.",
        principle: "Specificity is credibility. 'Trained extensively' < 'Every team member completes X hours of training before they ever step on a campus.' The more specific, the more believable." },
      { text: "I totally understand the skepticism. Look — I don't want to take more of your time. Can I come back next week for 15 minutes?", next: "a3b", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
        feedback: "She asked 'what specifically would be different?' — a direct question deserving a direct answer — and you deflected to a follow-up request. She'll interpret this as you not having a good answer.",
        principle: "When a direct person asks a direct question, give a direct answer. Deflecting to a follow-up meeting feels like avoidance — and with someone who's been burned before, avoidance confirms their suspicion that you're 'all talk.'" }
    ]},
    a3: { speaker: "them", name: "Mrs. Gutierrez", text: "...Alright. That's more specific than what I usually hear. But I'm still not ready to commit to anything. My teachers' trust took a long time to rebuild after that last experience.", options: [
      { text: "I hear that — and I wouldn't ask you to commit to anything today. Does that sound fair?", next: "x1", scores: { empathy: 3, discovery: 0, framing: 2, momentum: 3 }, rating: "excellent",
        feedback: "Textbook commitment ladder: small, specific, low-risk next step. 'No pressure' is honest, not a technique — because you also said 'I'd rather you say no for the right reasons.' That's Hormozi's 'I want you to decide, not buy' frame. And the peer reference from a similarly burned principal is devastating social proof.",
        principle: "Commitment and Consistency (Cialdini): a small yes (15-minute meeting) creates psychological momentum toward a larger yes. But the key is that the commitment must feel voluntary and low-risk. 'If it doesn't feel right, I'll respect that' preserves her autonomy and paradoxically makes her more likely to commit." },
      { text: "Completely understand. Would it make sense for me to leave you some materials and check back in a month?", next: "x1", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "okay",
        feedback: "A month is too long. You've built trust in this conversation — waiting 30 days lets it dissipate. A follow-up next week with a specific peer reference would maintain momentum while still respecting her pace.",
        principle: "Blount's 30-Day Rule: prospecting momentum is perishable. The trust you built today has a half-life. Waiting a month means starting over." },
      { text: "What if you just tried us for one event and we could prove ourselves? Low risk — if it's not great, you never have to see me again.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "poor",
        feedback: "'If it's not great, you never have to see me again' is self-deprecating and puts the worst-case scenario front and center. A burned principal doesn't want to hear about the exit — she wants to hear about the safeguards. Position the trial as low-risk, not as a gamble.",
        principle: "Loss Aversion (Kahneman): people feel losses 2x as intensely as gains. 'You never have to see me again' highlights the loss scenario. Better to highlight the safeguards: pre-meeting, campus walk, personal accountability." }
    ]},
    a3b: { speaker: "them", name: "Mrs. Gutierrez", text: "Next week could work. Thursday after 2:00? Fifteen minutes, that's it.", options: [
      { text: "Thursday at 2:00 works perfectly. I'll keep it to fifteen — promise. Before then, is there anything specific about Pinewood's needs I should be thinking about? I want to come prepared for YOUR school, not with a generic pitch.", next: "x1", scores: { empathy: 1, discovery: 2, framing: 1, momentum: 3 }, rating: "excellent",
        feedback: "You confirmed the commitment, respected the time limit, and asked a discovery question that shows you're preparing FOR HER. Thursday's meeting will be tailored because you asked now. The best thing about a follow-up meeting is that you can prepare — use the gap.",
        principle: "Book a Meeting from a Meeting, then prepare specifically. The question 'is there anything specific about Pinewood's needs?' will give you intelligence that transforms Thursday from a generic pitch into a customized conversation." },
      { text: "Perfect! I'll bring some materials and a video. You're going to love what you see. See you Thursday! I'm happy to share details whenever it's useful for you. Either way, it has to be the right fit for your staff and your students.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 2 }, rating: "okay",
        feedback: "'You're going to love it' is presumptuous for someone who's been burned. And you missed a discovery opportunity — asking what Pinewood needs would have made Thursday's meeting significantly better.",
        principle: "Never tell a burned buyer they'll love something. Let the product earn its own praise. And every conversation before the meeting is prep — don't waste it." },
      { text: "Great, see you then! I'll send an email to confirm. Most schools tell us it's the easiest thing on their calendar all year. And honestly, the whole thing is completely turnkey on your end — we handle the assembly, the lessons, the prizes, everything.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
        feedback: "You locked the meeting but learned nothing new. Thursday will be a generic pitch instead of a targeted conversation. One discovery question now saves 10 minutes of fumbling then.",
        principle: "Good salespeople secure meetings. Great salespeople secure meetings AND set them up to succeed." }
    ]},
    b1: { speaker: "them", name: "Mrs. Gutierrez", text: "That's nice, but every vendor says they're different. We had a company promise the same thing and it was a disaster. What happened to my school can't happen again.", options: [
      { text: "I believe you — and I don't blame you for being skeptical. Can I ask: what specifically happened? I want to understand what went wrong so I can address your actual concerns, not just give you a sales pitch.", next: "a1", scores: { empathy: 2, discovery: 3, framing: 0, momentum: 1 }, rating: "excellent",
        feedback: "Smart recovery. You stopped pitching and started listening. Her bad experience is the key that unlocks this conversation — every specific failure she mentions becomes a specific thing you can address.",
        principle: "When someone shares a bad past experience, that's a gift. It tells you exactly what they need to hear to trust you. Ask about it, don't deflect from it." },
      { text: "I understand. What if I connected you with a principal who had a similar experience and has been with Apex for three years? Sometimes hearing it from a peer means more than from a salesperson.", next: "a3b", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
        feedback: "Social proof is good, but you're deflecting to someone else before addressing HER concern yourself. Ask what happened first, then offer the reference as confirmation.",
        principle: "References reinforce — they don't replace. Answer the concern yourself first, then offer the peer as backup." },
      { text: "I hear you. Look, I don't want to push. Can I leave you my card and some info? Once you see event day, you'll understand why schools stay with us year after year.", next: "x1", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "She just shared a real concern and you retreated. The card goes in a drawer. You had a moment to go deeper and you chose to go home.",
        principle: "One 'no' doesn't end the conversation — it redirects it. Stay curious, not cautious." }
    ]},
    b1b: { speaker: "them", name: "Mrs. Gutierrez", text: "I'm not going to name the company. That's not the point. The point is it disrupted my school and I won't let it happen again.", options: [
      { text: "You're absolutely right — the company doesn't matter. What matters is what happened to your school. Can you tell me more about what the disruption looked like? I want to make sure I address your real concerns, not just give you talking points.", next: "a1", scores: { empathy: 2, discovery: 3, framing: 0, momentum: 1 }, rating: "excellent",
        feedback: "Good recovery from the competitor-naming mistake. You acknowledged her correction, refocused on what matters (her school), and asked for specifics. You're back on the discovery track.",
        principle: "When you make a misstep, don't apologize excessively — redirect with genuine curiosity. She corrected you; accept it and move forward with better questions." },
      { text: "Of course — sorry for asking. I just want you to know that Apex is a local franchise model, so I'm your accountable point of contact for everything that happens at your school. There's no pressure on my end at all.", next: "a2b", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
        feedback: "The local franchise differentiation is relevant but you jumped to it before understanding what specifically went wrong. Without that context, 'I'm your accountable point of contact' is a claim, not evidence.",
        principle: "Claims without context are just promises. 'I'm your accountable point of contact' means more when you can say 'the thing that went wrong at your school can't happen with me because of X, Y, Z.'" },
      { text: "Fair enough. Let me tell you about Apex and how we're different from what you experienced. Our online platform makes the whole thing seamless for parents, too. Most schools tell us it's the easiest thing on their calendar all year.", next: "a2b", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "poor",
        feedback: "You just pivoted to your pitch without understanding her pain. 'How we're different' — different from what? You don't know the specifics yet. This will be a generic pitch that may or may not address her actual concern.",
        principle: "You can't differentiate effectively if you don't know what you're differentiating FROM. Ask first, then tailor." }
    ]},
      x1: { speaker: "them", name: "Mrs. Gutierrez",
        text: "Alright, you have my attention. Walk me through the logistics — what does this actually ask of my teachers and my front office?",
        options: [
          { text: "One decision on your end: you approve the dates. From there, my team takes over — we come in, learn your school, your teachers, your students, and work as an extension of your staff for the full two weeks. Every communication piece comes ready to send, parent emails and social posts included. What would make that easiest for your front office?",
            next: "x2", scores: { empathy: 1, discovery: 2, framing: 1, momentum: 1 }, rating: "excellent",
            feedback: "Specific and concrete: one named ask (approve the dates), a clear picture of what the school never touches, and you handed the conversation back with a question. 'Extension of your staff' answers the real worry — that this becomes their project to manage.",
            principle: "Gap Selling: buyers trust specifics. 'Turnkey' is a claim; 'you approve the dates and every parent email comes ready to send' is evidence." },
          { text: "Honestly, almost nothing — we're known for being the easiest thing on a school's calendar. We take care of the details from start to finish, our platform makes everything seamless for families, and you and your staff mostly just get to enjoy the two weeks with your students.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
            feedback: "Reassuring, but it's all adjectives — easiest, seamless, everything. A skeptical administrator has heard those exact words from every vendor who ever walked in. One concrete detail about what they actually do (and don't do) would have done the convincing for you.",
            principle: "Claims without detail sound like every other pitch. Specificity is what separates confidence from salesmanship." },
          { text: "That's the best part — we take care of absolutely everything. Registration, donations, prize tracking, parent emails, social media content, the event itself, all of it. I can send you our full program guide and a complete feature breakdown tonight so you can see the whole picture for yourself.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They asked what it costs their people, and you answered with a feature dump and homework — a program guide to read. The question behind the question was 'will this burden my staff,' and it went unanswered while you talked about yourself.",
            principle: "Answer the concern, not the keyword. A feature list is your agenda; their workload was theirs." },
        ],
      },
      x2: { speaker: "them", name: "Mrs. Gutierrez",
        text: "Okay. I'm not saying yes today. But if we were going to move forward, what would happen next?",
        options: [
          { text: "A 15-minute call next week with you and whoever runs your fundraising — I'll bring a one-page plan with proposed dates and a realistic goal for your school. If it doesn't fit, you've lost 15 minutes and you'll still know exactly what a program here would look like. Does Tuesday or Thursday work better?",
            next: "end_win", scores: { empathy: 1, discovery: 1, framing: 1, momentum: 3 }, rating: "excellent",
            feedback: "A small, concrete, low-risk next step with a built-in choice of times. You made saying yes easier than saying no, and you pulled in the other decision-makers now instead of discovering them three meetings from now.",
            principle: "Momentum lives in specifics: a date, a duration, a deliverable. Vague follow-ups die in inboxes." },
          { text: "I'll email you our information packet and some references from schools in our network, and you can look everything over whenever you have time. I know you've got a lot on your plate, so just reach out whenever you're ready to talk more.", next: "end_mid",
            scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "okay",
            feedback: "Polite and respectful of their time, but you handed the momentum away. 'Reach out when you're ready' means the next step depends entirely on a busy administrator remembering you exist in three weeks. The door stays open — barely.",
            principle: "Never leave a conversation without a next step that has a name and a date on it." },
          { text: "Well, I'll be honest — our calendar fills up fast this time of year, and most schools lock in their week by the end of the month. I'd hate for you to lose your spot to another school, so the sooner we can get something signed, the better for everyone.", next: "end_loss",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They told you they're not saying yes today, and you answered with a pressure close. Manufactured scarcity right after a trust-building conversation undoes the trust — they hear the tactic, not the deadline. The relationship took the hit.",
            principle: "Voss: a forced 'yes' is worthless. Pressure at the close converts a warm maybe into a polite never." },
        ],
      },

    end_win: { speaker: "n", text: "", isEnd: true, endType: "win",
      endMessage: "You turned 'no outside organizations — period' into a follow-up meeting with a specific agenda. You did it by asking about her bad experience instead of pitching over it, by addressing her specific concerns with specific safeguards, and by using the Accusation Audit to make her feel in control. Burned buyers need proof, not promises — and you offered peer references, personal accountability, and a low-risk next step.",
      summary: "With burned buyers: ask what went wrong, address those specific failures, offer peer proof from similarly burned principals, and give them veto power at every step. Trust is rebuilt through specifics, not pledges." },
    end_mid: { speaker: "n", text: "", isEnd: true, endType: "mid",
      endMessage: "You've got a next step, which matters for a closed-door school. But the follow-up needs to be highly tailored — generic materials won't overcome her skepticism. Bring a specific reference from a similarly burned principal and address her exact concerns point by point.",
      summary: "The door cracked open. Don't waste it with a generic follow-up. Tailor everything to her specific bad experience." },
    end_loss: { speaker: "n", text: "", isEnd: true, endType: "loss",
      endMessage: "A card on a desk won't call itself. You had a rare audience with a closed-door principal and retreated before the conversation started. The front office staff invested in getting you this meeting — make the next one count by staying curious through the resistance.",
      summary: "Every drop-by is an earned opportunity. Retreating at the first objection wastes the relationship capital you've built. Stay curious, not cautious." }
  }
);

const S4 = makeScenario(
  "boosterthon", "\"We Already Use Boosterthon\"", "Lakewood Elementary — PTA Meeting Pop-In", "Advanced",
  "You popped into a PTA meeting at Lakewood where they've used Boosterthon for two years. Jennifer, the PTA fundraising chair, says it's 'been fine.' Principal Martinez is present and seems lukewarm. The key: never badmouth Boosterthon. Position as complement or alternative based on what THEY value.",
  "Jennifer — Organized, loyal to what works, doesn't like change for change's sake. Principal Martinez — Quiet, watching, will speak up if something resonates with his priorities (school culture, teacher support).",
  ["Never badmouth competitors", "Ask what they love and what they'd improve", "The complement positioning", "Teaching the net-dollars insight", "Getting the quiet stakeholder to speak"],
  {
    start: { speaker: "them", name: "Jennifer", text: "We appreciate you coming, but we've been with Boosterthon for two years and it's worked fine for us. I'm not sure what another fun run company would offer that's different enough to make switching worth the hassle.", options: [
      { text: "That makes total sense — and honestly, switching for switching's sake never makes sense. I'm not here to badmouth Boosterthon. And if you could wave a magic wand and change one thing about the experience, what would it be?", next: "a1", scores: { empathy: 3, discovery: 3, framing: 0, momentum: 0 }, rating: "excellent",
        feedback: "You eliminated the adversarial frame ('not here to badmouth'), validated loyalty, and asked the most powerful two-part question in consultative selling. 'What do you love?' builds rapport. 'What would you change?' reveals the gap. Together, they give you a complete picture — AND they make her think critically about something she's been on autopilot about.",
        principle: "The magic wand question (Salesperson's Mind) bypasses status quo bias and goes straight to aspirations. Her answer to 'what would you change?' IS your pitch — because whatever she says, you'll address it with Apex's differentiators. And by asking what she loves first, you've earned the right to explore what's missing." },
      { text: "I totally get that. Boosterthon is a solid program. But Apex is actually quite different — we focus on character education with a PBIS-aligned curriculum, and our franchise model means you get a local owner, not a corporate team.", next: "b1", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "You differentiated without badmouthing — good. But you pitched before understanding what Jennifer values. If she cares most about ease, your PBIS-alignment pitch misses. If she cares about money, your franchise model pitch misses. Discover first, then tailor.",
        principle: "Challenger Sale: teach, TAILOR, take control. You skipped the tailoring step by going straight to generic differentiators. The same Apex features land differently depending on what the buyer cares about." },
      { text: "How much did you raise with them last year, if you don't mind my asking? And honestly, the whole thing is completely turnkey on your end — we handle the assembly, the lessons, the prizes, everything.", next: "c1", scores: { empathy: 0, discovery: 1, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "Going straight to revenue signals you're here to compete on dollars. She'll either lowball the number or get defensive. And it makes the conversation transactional before you've built any rapport. Lead with experience questions, not money questions.",
        principle: "Never lead with money. The moment you make it a numbers competition, you've commoditized the conversation. Ask about the EXPERIENCE first — the money comparison is more powerful when it emerges naturally from the gap." }
    ]},
    a1: { speaker: "them", name: "Jennifer", text: "The event day is great — kids love it, it's well organized. But honestly? The follow-up is kind of weak. Pledge collection took forever last year, and the team that came... they were fine, but they didn't really know our school. They showed up, did their thing, and left. It felt kind of corporate.", options: [
      { text: "So the energy and the event are strong — but the relationship piece and the follow-up feel transactional. Like they run a program AT your school but not really WITH your school?", next: "a2", scores: { empathy: 3, discovery: 1, framing: 2, momentum: 1 }, rating: "excellent",
        feedback: "Voss labeling at its best. You reflected her frustration back in values language — 'AT your school but not WITH your school' — which is more precise than what she said. This is the kind of label that produces a 'that's right.' And it sets up Apex's local franchise model as the direct contrast without you having to draw the comparison.",
        principle: "Labeling (Voss): when you name someone's frustration more precisely than they did, you prove you understand at a level beyond the surface. 'That's right' is the most powerful response in negotiation — it means you've understood them so well that their guard drops completely." },
      { text: "Collection issues are really common with some programs — that's a frustration I hear a lot. Our online platform makes giving seamless for families — donations come in digitally, so there's no chasing pledges and no cash counting for your volunteers.", next: "b2", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "Good differentiators (collection rate, local presence), but 'I hear a lot' subtly badmouths the competitor by implying their collection issues are well-known. And you jumped to features before fully acknowledging her emotional concern — the corporate, transactional feel.",
        principle: "Carnegie: never criticize, even by implication. 'That's a frustration I hear a lot' about Boosterthon IS indirect criticism. Better to focus entirely on what Apex does, without referencing what others don't." },
      { text: "I see. If you could keep the event energy but add a team that actually knows your school — teachers by name, schedule dialed in, feels like part of your community — would that be worth exploring?", next: "a2", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 2 }, rating: "okay",
        feedback: "Good future-pacing question — you're helping her envision the better version. But you jumped past the emotional acknowledgment. She said it felt 'corporate' — that word carries weight. Label it before you solve it.",
        principle: "Future pacing is powerful, but it lands better after the prospect feels heard. If you skip the empathy to get to the vision, the vision feels like a sales pitch instead of a natural next step." }
    ]},
    a2: { speaker: "them", name: "Jennifer", text: "[pauses] Yeah... that's actually exactly how it feels. They do their thing and go. There's no real connection to the school.", options: [
      { text: "[turn to Principal Martinez] Principal Martinez, I'm curious — from your perspective, how does that 'corporate' feel affect the school culture side? I imagine you see it differently from the administrative angle.", next: "a3", scores: { empathy: 2, discovery: 3, framing: 1, momentum: 1 }, rating: "excellent",
        feedback: "Masterful stakeholder management. Jennifer gave you a 'that's right' — now you're bringing in the quiet decision-maker. Principals and PTA chairs evaluate programs through different lenses (Pink's Attunement): Jennifer cares about logistics and ease; Martinez cares about culture and teachers. By asking him directly, you're multi-threading the conversation AND showing you understand the different stakeholder priorities.",
        principle: "Multi-threading (Salesperson's Mind): a deal that rests on one contact is a single-threaded deal. When the quiet stakeholder speaks, listen hard — their concern is often the one that kills or closes the deal. And asking a principal 'how does this affect school culture?' is speaking directly to their primary concern." },
      { text: "That's actually the biggest difference between Apex and most programs. I'm a franchise owner — I live in this community. When I come to your school, I know your teachers by name by day three.", next: "b2", scores: { empathy: 1, discovery: 0, framing: 3, momentum: 1 }, rating: "okay",
        feedback: "Strong differentiation — the local franchise model directly addresses 'feels corporate.' But you missed the opportunity to bring Principal Martinez into the conversation. He's been quiet, and quiet stakeholders are often the real decision-makers.",
        principle: "In multi-stakeholder meetings, read the room. The person who asks the most questions is often not the decision-maker. The quiet one who's watching — that's who you need to engage." },
      { text: "If that resonates, I'd love to show you what a more connected experience looks like. Can I come back for a 15-minute meeting with you and the principal?", next: "b3", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 2 }, rating: "poor",
        feedback: "The principal is RIGHT HERE. You don't need a separate meeting to include him — ask him a question now. Requesting a future meeting with someone already in the room signals you're not confident enough to engage them directly.",
        principle: "When all the stakeholders are in the room, use it. Don't defer a conversation to a future meeting that could happen right now." }
    ]},
    a3: { speaker: "them", name: "Pr. Martinez", text: "I'll be honest — the event is fine for the kids, but it doesn't really connect to anything we're doing in the school. It's a fun day, and then it's over. If I'm bringing someone into my building for two weeks, I'd want it to reinforce what we're already teaching — character, leadership, school-wide values. Right now, it's just... an event.", options: [
      { text: "That's a really important distinction — an event versus a program that builds on your culture. Apex was designed exactly for that. Would it be worth showing you what those daily lessons look like?", next: "a4", scores: { empathy: 1, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
        feedback: "You took the principal's exact language ('reinforce what we're teaching' and 'just an event') and addressed both directly. This is the Challenger teaching moment — you're showing him something he didn't know existed (a fundraiser that IS a character education program). By quoting the specific theme and specific traits, you demonstrate depth, not just marketing.",
        principle: "Challenger Sale in action: you taught him something new ('Apex isn't a fun run — it's a character education program that funds itself'), tailored to his specific concern ('reinforce what we're teaching'), and backed it with credible specifics (600 educators, named traits). This is the insight that changes his evaluation criteria." },
      { text: "I hear that. Apex is definitely more of a character program than just a fundraiser — we do daily leadership lessons tied to PBIS-aligned traits. I think you'd see a big difference from what you've experienced.", next: "a4", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "Right direction but too general. 'More of a character program' and 'PBIS-aligned traits' are vague. The specific theme name, the specific traits, the specific development process — those details are what make the Challenger insight land with credibility.",
        principle: "Specificity is the credibility signal (Salesperson's Mind). '600 educators developed six character traits: Steady, Uplifter, Purpose, Extra Mile, Reliable, Hero' is 10x more credible than 'PBIS-aligned character traits.' Same idea, completely different impact." },
      { text: "That makes sense. What if I came back to do a quick presentation for you both? I think once you see the full program, you'll see how different it is.", next: "b3", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "poor",
        feedback: "The principal just told you EXACTLY what he cares about — and you offered a generic presentation instead of addressing it. He's in the room. He gave you his buying criteria ('connect to what we're teaching'). Address it NOW, not in a future presentation.",
        principle: "When a stakeholder gives you their buying criteria, match it immediately. Deferring to a future presentation wastes the moment and risks losing their engagement." }
    ]},
    a4: { speaker: "them", name: "Jennifer", text: "I have to admit, the character education piece is interesting. We don't get that with what we have now. But switching is a pain — we'd have to notify parents, change the fundraising page, explain to the PTA board why we're not going back...", options: [
      { text: "Those are real logistics — and I don't want to pretend switching is effortless. What would you need to feel confident presenting this to the board?", next: "x1", scores: { empathy: 2, discovery: 1, framing: 3, momentum: 3 }, rating: "excellent",
        feedback: "You acknowledged the logistics as real (not minimized them), offered specific solutions for each, then reframed the decision as a value calculation. The calibrated question at the end ('what would you need to feel confident?') puts her in problem-solving mode — she's now thinking about HOW to make the switch, not WHETHER to make it. That's a commitment shift.",
        principle: "Calibrated Questions (Voss): 'What would you need?' invites her to solve the problem herself. She can't answer that question without mentally committing to the possibility of switching. And by summarizing the gaps BOTH stakeholders identified, you're reflecting back their own case for change — they're persuading themselves." },
      { text: "We handle most of that — communication templates, pledge platform, everything. And I'd be happy to come present to the PTA board. Want me to set that up?", next: "x1", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
        feedback: "You addressed the logistics, which helps. But jumping to 'want me to present to the board?' is a big ask. She hasn't committed to switching yet — she said the character education piece is 'interesting.' That's curiosity, not commitment. Match your ask to her readiness.",
        principle: "Commitment Ladder: she's at 'this is interesting' — not 'let's switch.' The right next step is smaller: a sample lesson, a peer reference, a one-pager for the board. Asking to present to the board skips three rungs on the ladder." },
      { text: "It's actually easier than you'd think! We make the transition really smooth. Want me to walk you through the timeline?", next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
        feedback: "You minimized real logistics concerns. She's mentally listing everything she'd have to do, and you responded with 'it's easy.' That's dismissive — especially to the person who'll actually have to do the work. Acknowledge, then solve.",
        principle: "Never minimize the work someone is picturing. Acknowledge it, then show them specifically how the burden is lighter than they think. 'It's easy' is a claim. 'Here's exactly how we handle each piece' is evidence." }
    ]},
    b1: { speaker: "them", name: "Jennifer", text: "How is the character education piece different from what we already get? They do something with character too.", options: [
      { text: "Good question. Rather than me telling you what's different on paper, can I ask: how does the character component show up during the two weeks? Are there daily lessons in classrooms, or is it more of a theme for the event day?", next: "a1", scores: { empathy: 1, discovery: 3, framing: 1, momentum: 1 }, rating: "excellent",
        feedback: "Smart pivot back to discovery. Her answer will reveal whether Boosterthon's character component is deep or surface-level — and the answer to that question will make your differentiation much more targeted. You don't need to claim you're better; you need her to describe the gap herself.",
        principle: "The most powerful differentiation comes from the prospect's own words. When she describes what the character component actually looks like, the gap reveals itself. You don't need to draw the comparison — she'll draw it for you." },
      { text: "Our curriculum was developed with input from over 600 educators and it's fully PBIS-aligned. The Superheroes theme this year focuses on six specific character traits: Steady, Uplifter, Purpose, Extra Mile, Reliable, and Hero.", next: "b2", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "Good specifics, but you're making claims without understanding what she already gets. If Boosterthon's character piece is also daily lessons, your differentiator falls flat. Ask first, then tailor your answer to the actual gap.",
        principle: "Differentiation without context is just features. Differentiation that addresses a known gap is a solution." },
      { text: "Honestly, I'm not super familiar with their character program. What I can tell you is that ours is substantive — not just stickers and slogans. Once you see event day, you'll understand why schools stay with us year after year.", next: "c1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "'Not just stickers and slogans' is an indirect shot at the competitor. Even if you didn't name them, the implication is clear. And admitting you're not familiar with their program while criticizing it undermines your credibility.",
        principle: "Carnegie: never criticize. And never comment on a competitor's program you can't speak to knowledgeably. Better to ask what their experience is and let the contrast emerge naturally." }
    ]},
    b2: { speaker: "them", name: "Pr. Martinez", text: "The character education and PBIS alignment — that's what would actually make this worth considering. If it's substantive and not just a theme overlay, I'd want to see it.", options: [
      { text: "It's substantive. This year's Superheroes theme was built with direct input from over 600 educators — each trait was chosen because it maps to real PBIS language and real classroom behaviors. Would 15 minutes next week work for both of you?", next: "x1", scores: { empathy: 0, discovery: 0, framing: 3, momentum: 3 }, rating: "excellent",
        feedback: "You addressed the principal's specific concern (substance, not theme overlay) with specific evidence (600 educators, PBIS mapping), offered the Endowment Effect play (sample lesson), and closed with a specific next step that includes both stakeholders. The sample lesson does your selling — once he sees the quality, the status quo bias weakens.",
        principle: "Endowment Effect + Book a Meeting from a Meeting. The sample lesson creates psychological ownership. The scheduled follow-up prevents momentum from dying. Together, they make the switch feel real and close." },
      { text: "I can send you our curriculum overview. Want me to email it to you this week? But you know your school better than I do, so I'll follow your lead. I'm happy to share details whenever it's useful for you.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
        feedback: "An overview is weaker than a sample lesson. He asked to 'see it' — give him something to experience, not just read about. And 'this week' is vague. Tomorrow morning, with a specific follow-up date, would be stronger.",
        principle: "Show, don't tell. A sample lesson is experiential; an overview document is informational. The Endowment Effect activates through experience, not information." },
      { text: "Great! It's very substantive. Let me know when you're free and I'll come do a full presentation. Our online platform makes the whole thing seamless for parents, too. Most schools tell us it's the easiest thing on their calendar all year.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
        feedback: "He said 'I'd want to see it' and you said 'let me know when you're free.' That puts the burden on him. Send the sample lesson proactively and suggest a specific date. Don't wait for them to create your next step.",
        principle: "Never outsource your follow-up to the prospect. Set the next step yourself — specific date, specific deliverable." }
    ]},
    b3: { speaker: "them", name: "Jennifer", text: "Maybe. Let me talk to the PTA board first and see if there's any interest. Can you send me some info?", options: [
      { text: "Of course. But rather than a generic info packet — would it be more helpful if I sent a sample leadership lesson and a quick one-pager that shows how Apex specifically addresses the two things you both mentioned: the character education piece and the local, connected feel?", next: "x1", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 2 }, rating: "excellent",
        feedback: "You elevated the follow-up from generic info to targeted materials based on what BOTH stakeholders said they cared about. This is the Challenger Customer principle: arm your champion with tools tailored to the specific gaps the team identified.",
        principle: "When 'send me info' threatens to end a conversation, upgrade the follow-up to something worth their time. Targeted beats generic. Sample lessons beat brochures. And referencing what THEY said they cared about shows you listened." },
      { text: "Will do! I'll send our overview packet and the event video. When's your next PTA board meeting? Either way, it has to be the right fit for your staff and your students. There's no pressure on my end at all.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "okay",
        feedback: "Generic materials going to a PTA board that hasn't been primed. The overview packet won't address the specific concerns raised in this conversation. Tailor everything.",
        principle: "The materials you send should echo the conversation you had, not the brochure you printed." },
      { text: "Sure! Check out our website too — apexleadershipco.com. Lots of info there. I'm always available if questions come up! And honestly, the whole thing is completely turnkey on your end — we handle the assembly, the lessons, the prizes, everything.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "You just sent an interested contact to do her own research. She won't. The website visit doesn't happen, the PTA meeting doesn't mention Apex, and this conversation evaporates.",
        principle: "Never outsource your follow-up to the prospect's initiative. 'Check out our website' is not a sales strategy — it's a prayer (Gitomer)." }
    ]},
    c1: { speaker: "them", name: "Jennifer", text: "We raised about $28,000 last year. It was decent.", options: [
      { text: "$28,000 is solid — and from what you've said, the event day was well executed. Can I ask: what did the collection process look like? And how much involvement did the PTA have beyond the coordination?", next: "a1", scores: { empathy: 1, discovery: 3, framing: 0, momentum: 1 }, rating: "excellent",
        feedback: "Good recovery. You validated the number, then pivoted to discovery about the pain points (collection, PTA workload). These are the areas where Apex often differentiates — and she's more likely to reveal gaps in a specific question than a general one.",
        principle: "When you have the revenue number, don't immediately compare it to Apex projections. Explore the EXPERIENCE first — the effort, the collection, the feel. The money comparison is more powerful when it follows the experience gap." },
      { text: "That's good! With Apex, similar schools typically raise $35,000-$50,000 — so you could be looking at a significant increase, even with our revenue split. But you know your school better than I do, so I'll follow your lead.", next: "b2", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
        feedback: "You went straight to the revenue comparison, which makes you look like you're competing on dollars alone. She said 'decent' — which means she's not unhappy with $28K. The gap you need to surface is the EXPERIENCE, not just the money.",
        principle: "Don't compete on the dimension where they're already satisfied. She's fine with $28K. Find the dimension where there IS a gap — character education, collection, PTA workload, community feel — and differentiate there." },
      { text: "Not bad! But I bet you could do a lot more. Want to hear what schools your size typically raise with Apex? Once you see event day, you'll understand why schools stay with us year after year.", next: "b2", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 0 }, rating: "poor",
        feedback: "'Not bad, but you could do more' is dismissive of what they've accomplished. She's going to defend $28K instead of exploring the gap. And 'want to hear what schools raise?' puts you in pitch mode, not discovery mode.",
        principle: "Carnegie: give honest appreciation, never criticize. '$28K is solid' opens the conversation. 'Not bad, but...' closes it." }
    ]},
      x1: { speaker: "them", name: "Jennifer",
        text: "Alright, you have my attention. Walk me through the logistics — what does this actually ask of my teachers and my front office?",
        options: [
          { text: "One decision on your end: you approve the dates. From there, my team takes over — we come in, learn your school, your teachers, your students, and work as an extension of your staff for the full two weeks. Every communication piece comes ready to send, parent emails and social posts included. What would make that easiest for your front office?",
            next: "x2", scores: { empathy: 1, discovery: 2, framing: 1, momentum: 1 }, rating: "excellent",
            feedback: "Specific and concrete: one named ask (approve the dates), a clear picture of what the school never touches, and you handed the conversation back with a question. 'Extension of your staff' answers the real worry — that this becomes their project to manage.",
            principle: "Gap Selling: buyers trust specifics. 'Turnkey' is a claim; 'you approve the dates and every parent email comes ready to send' is evidence." },
          { text: "Honestly, almost nothing — we're known for being the easiest thing on a school's calendar. We take care of the details from start to finish, our platform makes everything seamless for families, and you and your staff mostly just get to enjoy the two weeks with your students.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
            feedback: "Reassuring, but it's all adjectives — easiest, seamless, everything. A skeptical administrator has heard those exact words from every vendor who ever walked in. One concrete detail about what they actually do (and don't do) would have done the convincing for you.",
            principle: "Claims without detail sound like every other pitch. Specificity is what separates confidence from salesmanship." },
          { text: "That's the best part — we take care of absolutely everything. Registration, donations, prize tracking, parent emails, social media content, the event itself, all of it. I can send you our full program guide and a complete feature breakdown tonight so you can see the whole picture for yourself.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They asked what it costs their people, and you answered with a feature dump and homework — a program guide to read. The question behind the question was 'will this burden my staff,' and it went unanswered while you talked about yourself.",
            principle: "Answer the concern, not the keyword. A feature list is your agenda; their workload was theirs." },
        ],
      },
      x2: { speaker: "them", name: "Jennifer",
        text: "Okay. I'm not saying yes today. But if we were going to move forward, what would happen next?",
        options: [
          { text: "A 15-minute call next week with you and whoever runs your fundraising — I'll bring a one-page plan with proposed dates and a realistic goal for your school. If it doesn't fit, you've lost 15 minutes and you'll still know exactly what a program here would look like. Does Tuesday or Thursday work better?",
            next: "end_win", scores: { empathy: 1, discovery: 1, framing: 1, momentum: 3 }, rating: "excellent",
            feedback: "A small, concrete, low-risk next step with a built-in choice of times. You made saying yes easier than saying no, and you pulled in the other decision-makers now instead of discovering them three meetings from now.",
            principle: "Momentum lives in specifics: a date, a duration, a deliverable. Vague follow-ups die in inboxes." },
          { text: "I'll email you our information packet and some references from schools in our network, and you can look everything over whenever you have time. I know you've got a lot on your plate, so just reach out whenever you're ready to talk more.", next: "end_mid",
            scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "okay",
            feedback: "Polite and respectful of their time, but you handed the momentum away. 'Reach out when you're ready' means the next step depends entirely on a busy administrator remembering you exist in three weeks. The door stays open — barely.",
            principle: "Never leave a conversation without a next step that has a name and a date on it." },
          { text: "Well, I'll be honest — our calendar fills up fast this time of year, and most schools lock in their week by the end of the month. I'd hate for you to lose your spot to another school, so the sooner we can get something signed, the better for everyone.", next: "end_loss",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They told you they're not saying yes today, and you answered with a pressure close. Manufactured scarcity right after a trust-building conversation undoes the trust — they hear the tactic, not the deadline. The relationship took the hit.",
            principle: "Voss: a forced 'yes' is worthless. Pressure at the close converts a warm maybe into a polite never." },
        ],
      },

    end_win: { speaker: "n", text: "", isEnd: true, endType: "win",
      endMessage: "You did something rare: you engaged a school that's using a competitor without badmouthing the competitor once. Instead, you let Jennifer and Principal Martinez discover the gaps themselves — the transactional feel, the missing character education, the collection issues — and positioned Apex as the answer to THEIR concerns. The Challenger teaching moment (character education as the differentiator) came from the principal, not from you. That's self-persuasion, and it's far more durable than any pitch.",
      summary: "With competitor schools: never badmouth. Ask what they love and what they'd change. Let the gaps surface from their own reflection. Engage ALL stakeholders — the quiet one often holds the key. Then teach something they didn't know was possible." },
    end_mid: { speaker: "n", text: "", isEnd: true, endType: "mid",
      endMessage: "You've planted seeds. The door is open, but the case for switching isn't complete. Follow up with tailored materials that address the specific gaps from this conversation — the character education piece and the local feel. Include a sample lesson for the principal.",
      summary: "The conversation went well but the close wasn't tight enough. Tailor your follow-up to the specific gaps both stakeholders mentioned." },
    end_loss: { speaker: "n", text: "", isEnd: true, endType: "loss",
      endMessage: "The school stays with Boosterthon because nothing in this conversation gave them a compelling reason to change. Status quo bias is powerful — it takes a specific, felt gap to overcome it. Next time, uncover the gaps through discovery before pitching.",
      summary: "Status quo bias wins when you fail to surface a felt gap. Ask better questions about the experience, not just the results." }
  }
);

const S5 = makeScenario(
  "diy", "\"We Just Do It Ourselves\"", "Maple Grove Elementary — Lunch & Learn", "Standard",
  "You hosted a casual Lunch & Learn for PTA leaders. Sarah is the PTA president at Maple Grove — she's been running a DIY fun run for three years. She's proud of what her team built and skeptical that paying an outside company would be worth it. She organized this year's event in her garage. Her husband printed the t-shirts. She raised $14,000 and considers it a success. But she looks exhausted.",
  "Sarah — A doer. Proud, hands-on, community-oriented. Doesn't want to feel like her work wasn't good enough. Exhaustion is real but she won't admit weakness easily. Approach with genuine admiration, not pity.",
  ["Honoring the DIY effort", "Volunteer hour cost calculation", "Latent-to-realized pain model", "Net-dollars reframe for DIY", "Future pacing the relief"],
  {
    start: { speaker: "them", name: "Sarah", text: "I appreciate the lunch! But honestly, I'm not sure why we'd pay a company to do what we've been doing ourselves. We ran our own fun run last spring — printed the t-shirts, set up the course, DJ'd the music — and we raised $14,000. That's pretty good for a school our size, and we kept almost all of it.", options: [
      { text: "Honestly? That's really impressive. Running a fun run from scratch with your own team is a massive undertaking. Can I ask — how many hours would you say went into planning, setup, day-of, and cleanup? Just roughly.", next: "a1", scores: { empathy: 3, discovery: 3, framing: 0, momentum: 0 }, rating: "excellent",
        feedback: "You led with genuine admiration (Carnegie: make the other person feel important — sincerely), then asked the one discovery question that will change the entire conversation. When she calculates the volunteer hours, the 'free' fundraiser stops being free. This is moving her from latent pain (she's numb to the hours) to realized pain (she sees the cost). And you didn't challenge her success — you honored it.",
        principle: "Pain amplification: latent → realized → extreme (Hormozi/Miner). Sarah's volunteer hours are latent pain — she's been absorbing them without quantifying them. The question makes the pain realized. She's not going to like the number she gives you, and that discomfort is the gap that makes Apex's value visible." },
      { text: "That's great! But imagine what you could raise with a professional team and an online pledging platform. Schools our size typically raise $35,000-$50,000 with Apex. That's two to three times your current number — and you wouldn't have to lift a finger.", next: "b1", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "The math is compelling, but you dismissed her achievement in the first word ('That's great, BUT...'). She built this event in her garage. She's proud of it. Opening with 'you could do better' before honoring what she accomplished triggers defensiveness, not curiosity.",
        principle: "Carnegie's Rule #1: never criticize, condemn, or complain — and 'but' after a compliment IS criticism. Everything before 'but' is erased. If you must compare, honor the achievement first, THEN ask questions that let her discover the gap herself." },
      { text: "$14,000 with almost no overhead — that's solid. Most schools don't even come close to that with a DIY approach. What would you say is the hardest part of running it?", next: "a1b", scores: { empathy: 2, discovery: 2, framing: 0, momentum: 0 }, rating: "okay",
        feedback: "Good — you honored the achievement and asked about pain points. But 'what's the hardest part?' is slightly leading — she might feel defensive about admitting difficulty. The volunteer hours question is more neutral and more quantifiable.",
        principle: "Problem questions (SPIN) are more effective when they're specific and neutral rather than open-ended and emotional. 'How many hours?' produces a number she can evaluate objectively. 'What's the hardest part?' asks her to admit a weakness, which proud people resist." }
    ]},
    a1: { speaker: "them", name: "Sarah", text: "[long pause] I mean... probably 200 hours total? Between me, my co-chair, and the volunteers. The setup alone took three weekends. And then the pledge follow-up — my husband and I were chasing payments for six weeks after. That part was... yeah. That was a lot.", options: [
      { text: "200 hours. That's incredible commitment. And I don't want to diminish that — what you built is real. But can I share something that might reframe the picture? If you value those volunteer hours at even $20 each, your PTA donated $4,000 in labor to raise $14,000. free?", next: "a2", scores: { empathy: 2, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
        feedback: "This is the Gap Selling calculation done with surgical precision. You honored the work, quantified the hidden cost (latent → realized), did the math for her ($14K - $4K labor = $10K real net), and future-paced the relief ('your spring is just free'). The word 'free' is doing enormous work here — she just described a spring consumed by planning and chasing. Freedom is the emotional contrast.",
        principle: "Six Layers Deep: $14,000 raised → 200 volunteer hours → $4,000 in donated labor → $10,000 real net → three lost weekends → six weeks chasing payments → her marriage stress → her exhaustion. Each layer deepens the gap. You went three layers deep with the math and then future-paced the relief. The decision is now between '$10K net with 200 hours of pain' and '$20K+ net with 3 hours of ease.' That's not even close." },
      { text: "That's a LOT of hours. And with the pledge chasing — how much of the $14,000 did you actually collect? Because collection rates on DIY fundraisers are usually around 60-80%, which means the real number might be lower than $14,000.", next: "b2", scores: { empathy: 0, discovery: 1, framing: 1, momentum: 0 }, rating: "poor",
        feedback: "You just questioned whether her $14,000 is even real. She's proud of that number and you're poking holes in it before she's ready to hear it. The collection rate point is valid but the timing is terrible — it reads as 'actually, you didn't even raise what you think you did.' That's a trust-destroyer.",
        principle: "Never diminish someone's achievement to make your case. There's a difference between 'here's what you're not seeing' (productive reframe) and 'your number isn't even real' (criticism). The first creates curiosity; the second creates defensiveness. Timing and framing are everything." },
      { text: "200 hours is a huge lift. You should be proud of what you accomplished. Would you ever consider what it would look like to hand all of that off to a professional team? I'm happy to share details whenever it's useful for you.", next: "a1c", scores: { empathy: 2, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
        feedback: "Good empathy but the question is too vague. 'Would you consider handing it off?' — she's going to say 'maybe, depends on the cost.' You missed the chance to do the volunteer hour calculation, which is the most powerful reframe you have. Show her the math before asking if she's interested.",
        principle: "Don't ask if they're interested before showing them why they should be. The volunteer hour calculation IS the teaching moment. Lead with the insight, then ask the question." }
    ]},
    a1b: { speaker: "them", name: "Sarah", text: "The pledge collection, hands down. We're still chasing some families from last spring. And honestly, the setup and takedown is brutal. My husband printed 400 t-shirts in our garage — we were up until midnight the night before.", options: [
      { text: "400 t-shirts in a garage — that's dedication. Can I ask: roughly how many total volunteer hours do you think went into the whole thing? Planning, setup, day-of, and the collection follow-up?", next: "a1", scores: { empathy: 2, discovery: 3, framing: 0, momentum: 0 }, rating: "excellent",
        feedback: "You honored the specific detail (400 t-shirts), then steered toward the quantifiable pain. Once she gives you the hours, you have the data for the net-dollars calculation that changes the conversation.",
        principle: "Always move from emotional pain to quantifiable pain. 'Up until midnight' is emotional. '200 volunteer hours at $20 each = $4,000 in donated labor' is quantifiable. Emotional pain creates awareness; quantifiable pain creates urgency." },
      { text: "With Apex, all of that is handled — t-shirts for every student, professional setup, and a 98% pledge collection rate with deposits within a week. No garage printing, no chasing families.", next: "b1", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "The features directly address her pain points — good targeting. But you jumped to the solution before she's quantified the problem. The volunteer hour calculation would make these features feel like a rescue instead of a sales pitch.",
        principle: "SPIN timing: the move from Problem (pledge collection is awful) to Solution (we handle collection) feels premature without the Implication step (what does this cost you in time, stress, relationships?). Bridge the gap with one more question." },
      { text: "Yeah, the collection piece is where DIY really falls apart. Most DIY events only collect about 60-70% of pledges, which means you might have left $4,000-$6,000 on the table.", next: "b2", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 0 }, rating: "poor",
        feedback: "You criticized the one thing she's most sensitive about ('falls apart') and speculated about money she lost. Even if the collection rate stat is accurate, telling someone they left money on the table — especially someone who was up until midnight — reads as condescending, not helpful.",
        principle: "The tone of the reframe matters as much as the content. 'DIY collection rates are typically 60-70%' is neutral. 'DIY really falls apart on collection' is a judgment. Same information, completely different emotional impact." }
    ]},
    a1c: { speaker: "them", name: "Sarah", text: "I mean... if it made sense financially. But we kept almost all of our $14,000. With your split, we'd keep what — $23,000 of $45,000? That's more money, sure, but I also lost control.", options: [
      { text: "That's a really honest way to look at it — and the control piece matters. Let me add one number to the picture: if those 200 volunteer hours were valued at even $20 each, your PTA donated $4,000 in labor. So the real comparison isn't $14,000 vs.",
        next: "a2", scores: { empathy: 2, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
        feedback: "You addressed BOTH concerns — the money AND the control — without dismissing either. The volunteer hour calculation makes the financial case irrefutable, and the reframe on control ('approving instead of building') is the Challenger insight that changes how she thinks about the tradeoff.",
        principle: "Positions vs. Interests (Getting to Yes): her position is 'I want to keep control.' Her interest is 'I want the event to reflect my school's values.' Those are different things. By showing she'd still approve everything, you address the interest while reframing the position." },
      { text: "True, but you'd net more AND get your weekends back. Isn't that worth something? Either way, it has to be the right fit for your staff and your students. There's no pressure on my end at all.", next: "a2", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
        feedback: "Right idea, but asking 'isn't that worth something?' sounds like you're pressuring her to agree. She raised the control concern and you glossed over it. Address the control piece directly — that's the real objection.",
        principle: "When someone raises two concerns, address BOTH. Cherry-picking the easy one (money) and skipping the harder one (control) signals that you don't have an answer for it." },
      { text: "You'd actually raise a lot more than $45,000 — many schools your size hit $50,000 or more. And the experience for the kids is so much more professional. Our online platform makes the whole thing seamless for parents, too.", next: "a2", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 0 }, rating: "poor",
        feedback: "She said she's worried about losing control and you responded with a bigger revenue number. That's answering the question she didn't ask and ignoring the one she did. And 'more professional' subtly implies her DIY event was unprofessional. Be careful.",
        principle: "Attunement: listen for the concern underneath the question. She's not asking 'will I raise more?' — she's asking 'will I still feel ownership of this event?' Address the emotional concern, not just the logical one." }
    ]},
    a2: { speaker: "them", name: "Sarah", text: "[long pause] ...I never actually did the math on the volunteer hours before. That's... yeah. That changes how I think about it. But I need to talk to my co-chair. She's invested in this too — we built it together.", options: [
      { text: "Absolutely — she should be part of this conversation. What do you think would resonate most with her: the financial picture, the time savings, or the student experience? I want to make sure she sees what matters most to her, not just a generic pitch.", next: "a3", scores: { empathy: 2, discovery: 3, framing: 1, momentum: 2 }, rating: "excellent",
        feedback: "You respected the co-chair's role AND asked a tailoring question. Whatever Sarah answers tells you exactly how to frame the conversation for the next stakeholder. This is multi-threading AND Challenger tailoring in one move.",
        principle: "Challenger Customer: different stakeholders need different messages. Asking 'what would resonate with her?' is the most efficient way to tailor your next conversation. And it makes Sarah your ally in the internal sale — she's now helping you help her co-chair." },
      { text: "Of course. Would it help if I set up a quick call or coffee with both of you? I'd love to walk her through the same comparison. But you know your school better than I do, so I'll follow your lead.", next: "a3", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
        feedback: "Good next step offer. But you missed the chance to ask what the co-chair cares about. Walking her through 'the same comparison' assumes she has the same concerns as Sarah — she might care about something completely different.",
        principle: "Never assume stakeholders share the same priorities. Ask about each one individually. The few seconds of discovery now save you from delivering the wrong pitch later." },
      { text: "I can send you the one-pager we discussed and you can share it with her. Let me know what she thinks! Most schools tell us it's the easiest thing on their calendar all year.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "You just delegated your sale to Sarah's forwarding skills. She's not going to pitch Apex to her co-chair — she's going to forward an attachment with 'check this out.' That's not how deals move forward. Get in the room with the co-chair.",
        principle: "Never let your champion do your selling for you. Arm them with tools, but get yourself in front of the next stakeholder. Forwarded emails don't close deals — conversations do." }
    ]},
    a3: { speaker: "them", name: "Sarah", text: "The time savings, definitely. She has two little kids and she's been doing this on weekends and late nights. If she saw that she could get her spring back while RAISING more money? That would probably close the deal for her.", options: [
      { text: "Then let me make this easy: can we set up a 20-minute coffee with both of you? I'll bring the comparison — $10,000 net with 200 hours versus $20,000+ net with 3 hours — and let her see it for herself. When's a good day this week or next?", next: "x1", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 3 }, rating: "excellent",
        feedback: "Specific, actionable, and tailored. You're bringing the exact comparison that will land with the co-chair (time savings), you've kept it short (20 minutes = micro-commitment), and you gave them an exit ('no pressure at all'). Asking 'this week or next?' creates a bounded choice that's harder to defer than an open-ended 'when works?'",
        principle: "The This-or-That Close: 'this week or next?' gives a choice between two versions of yes. Combined with the specific deliverable (the comparison built from her numbers) and the safety net ('no pressure'), this is a textbook micro-commitment that advances the deal." },
      { text: "That's great intel. I'll put together something focused on the time savings and send it to both of you. Should I email her directly or go through you? I'm happy to share details whenever it's useful for you.", next: "x1", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
        feedback: "Getting the email is fine, but an in-person meeting would be much stronger. The volunteer hour calculation is devastating in person — it's just a number on a screen in an email. And asking 'should I email her or go through you?' defers to Sarah when you should be setting the agenda.",
        principle: "Face-to-face > phone > video > email > text. The farther you get from the conversation, the weaker the impact. If you can get in the room, get in the room." },
      { text: "Perfect — sounds like we have a plan. I'll follow up with you next week! And honestly, the whole thing is completely turnkey on your end — we handle the assembly, the lessons, the prizes, everything. Once you see event day, you'll understand why schools stay with us year after year.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "What plan? There's no specific next step, no date, no deliverable. 'I'll follow up next week' is the most common way deals die. Without a specific action and a specific date, this conversation evaporates.",
        principle: "Blount: never end a conversation without a specific, calendared next step. 'Next week' is not a plan. 'Tuesday at 10 AM for coffee with both of you' is a plan." }
    ]},
    b1: { speaker: "them", name: "Sarah", text: "Maybe, but we kept ALMOST ALL of the $14,000. Why would I give 48% away when I can keep it all?", options: [
      { text: "That's the most important question and I don't want to dodge it. Can I ask: how many total volunteer hours went into the whole event? Planning, setup, day-of, t-shirt printing, pledge collection — all of it?", next: "a1", scores: { empathy: 1, discovery: 3, framing: 0, momentum: 1 }, rating: "excellent",
        feedback: "You didn't argue the 48% directly — you went to the discovery question that will reframe it naturally. Once she gives you the hours, the 'kept it all' claim dissolves because the labor cost was invisible. This is Challenger reframing through questions, not assertions.",
        principle: "The most powerful reframes don't come from your statements — they come from the prospect's own answers. Her volunteer hours are the data that reframes the 48% conversation. Let her numbers do the work." },
      { text: "Here's the thing — you didn't really keep 'all' of it. You donated hundreds of volunteer hours. If you valued those at $20 an hour, you're looking at thousands in labor costs that don't show up on the spreadsheet.", next: "a2", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "The reframe is correct but the delivery is confrontational. 'You didn't really keep all of it' directly contradicts something she's proud of. Instead of telling her the hidden cost, ask the question that lets HER discover it.",
        principle: "A belief that a prospect reaches themselves is far more durable than one you installed through persuasion (Salesperson's Mind). Don't TELL her the volunteer hours are a cost — ask her to calculate them. Self-persuasion is 10x more powerful than external persuasion." },
      { text: "True, but $14,000 with a DIY approach is a lot lower than what professional programs raise. Schools your size typically hit $35,000-$50,000. Even at 52%, you'd net significantly more.", next: "b2", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 0 }, rating: "poor",
        feedback: "You told her that her $14,000 is 'a lot lower' than what she could raise. She'll hear this as 'your effort wasn't good enough.' Comparison without empathy is criticism. Honor the achievement, then surface the gap through questions.",
        principle: "Never compare a prospect's achievement unfavorably to your projections. It activates the Confirmation Bias defensively — she'll now spend the rest of the conversation defending $14K instead of exploring the gap." }
    ]},
    b2: { speaker: "them", name: "Sarah", text: "I didn't leave money on the table — we worked really hard to collect everything. And I don't appreciate the implication that what we built isn't good enough.", options: [
      { text: "You're right — that came out wrong, and I apologize. What you built is genuinely impressive. I'm not here to say it isn't good enough. What I'm genuinely curious about is the time it took. Is that something you've ever added up?", next: "a1", scores: { empathy: 3, discovery: 2, framing: 0, momentum: 0 }, rating: "excellent",
        feedback: "Honest, accountable recovery. You owned the misstep, reaffirmed her achievement, and redirected to the discovery question that still needs to be asked. The separation of 'quality' from 'hours' is important — you're not questioning what she built, just the cost of building it.",
        principle: "When you make a mistake, own it honestly (Gitomer). Don't over-apologize or collapse into deference — just redirect with genuine curiosity. She'll respect the accountability more than a smooth pivot." },
      { text: "I'm sorry — I didn't mean it that way at all. You clearly did an amazing job. I just want to show you how Apex could take that great foundation and build on it. Can I share some specifics?", next: "a1c", scores: { empathy: 2, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
        feedback: "The apology is good, but jumping to 'let me share specifics' is still prioritizing your pitch over her feelings. Give her a moment. Ask a question that shows you're genuinely interested in her experience, not just recovering to deliver your message.",
        principle: "After a trust-damaging moment, the recovery must be about THEM, not about your pitch. One more empathetic question rebuilds the bridge. Jumping to your presentation keeps the wound open." },
      { text: "I hear you — every school does it differently. Anyway, let me tell you what makes Apex unique... Our online platform makes the whole thing seamless for parents, too. Most schools tell us it's the easiest thing on their calendar all year.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "You brushed past her frustration and pivoted to your pitch. She's not listening anymore. The trust damage from the earlier comment wasn't repaired, and 'every school does it differently' dismisses her feelings without acknowledging the mistake.",
        principle: "When someone tells you they're offended, STOP. The sale is secondary to the relationship. Repair first, always. A dismissed frustration becomes a permanent wall." }
    ]},
      x1: { speaker: "them", name: "Sarah",
        text: "Alright, you have my attention. Walk me through the logistics — what does this actually ask of my teachers and my front office?",
        options: [
          { text: "One decision on your end: you approve the dates. From there, my team takes over — we come in, learn your school, your teachers, your students, and work as an extension of your staff for the full two weeks. Every communication piece comes ready to send, parent emails and social posts included. What would make that easiest for your front office?",
            next: "x2", scores: { empathy: 1, discovery: 2, framing: 1, momentum: 1 }, rating: "excellent",
            feedback: "Specific and concrete: one named ask (approve the dates), a clear picture of what the school never touches, and you handed the conversation back with a question. 'Extension of your staff' answers the real worry — that this becomes their project to manage.",
            principle: "Gap Selling: buyers trust specifics. 'Turnkey' is a claim; 'you approve the dates and every parent email comes ready to send' is evidence." },
          { text: "Honestly, almost nothing — we're known for being the easiest thing on a school's calendar. We take care of the details from start to finish, our platform makes everything seamless for families, and you and your staff mostly just get to enjoy the two weeks with your students.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
            feedback: "Reassuring, but it's all adjectives — easiest, seamless, everything. A skeptical administrator has heard those exact words from every vendor who ever walked in. One concrete detail about what they actually do (and don't do) would have done the convincing for you.",
            principle: "Claims without detail sound like every other pitch. Specificity is what separates confidence from salesmanship." },
          { text: "That's the best part — we take care of absolutely everything. Registration, donations, prize tracking, parent emails, social media content, the event itself, all of it. I can send you our full program guide and a complete feature breakdown tonight so you can see the whole picture for yourself.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They asked what it costs their people, and you answered with a feature dump and homework — a program guide to read. The question behind the question was 'will this burden my staff,' and it went unanswered while you talked about yourself.",
            principle: "Answer the concern, not the keyword. A feature list is your agenda; their workload was theirs." },
        ],
      },
      x2: { speaker: "them", name: "Sarah",
        text: "Okay. I'm not saying yes today. But if we were going to move forward, what would happen next?",
        options: [
          { text: "A 15-minute call next week with you and whoever runs your fundraising — I'll bring a one-page plan with proposed dates and a realistic goal for your school. If it doesn't fit, you've lost 15 minutes and you'll still know exactly what a program here would look like. Does Tuesday or Thursday work better?",
            next: "end_win", scores: { empathy: 1, discovery: 1, framing: 1, momentum: 3 }, rating: "excellent",
            feedback: "A small, concrete, low-risk next step with a built-in choice of times. You made saying yes easier than saying no, and you pulled in the other decision-makers now instead of discovering them three meetings from now.",
            principle: "Momentum lives in specifics: a date, a duration, a deliverable. Vague follow-ups die in inboxes." },
          { text: "I'll email you our information packet and some references from schools in our network, and you can look everything over whenever you have time. I know you've got a lot on your plate, so just reach out whenever you're ready to talk more.", next: "end_mid",
            scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "okay",
            feedback: "Polite and respectful of their time, but you handed the momentum away. 'Reach out when you're ready' means the next step depends entirely on a busy administrator remembering you exist in three weeks. The door stays open — barely.",
            principle: "Never leave a conversation without a next step that has a name and a date on it." },
          { text: "Well, I'll be honest — our calendar fills up fast this time of year, and most schools lock in their week by the end of the month. I'd hate for you to lose your spot to another school, so the sooner we can get something signed, the better for everyone.", next: "end_loss",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They told you they're not saying yes today, and you answered with a pressure close. Manufactured scarcity right after a trust-building conversation undoes the trust — they hear the tactic, not the deadline. The relationship took the hit.",
            principle: "Voss: a forced 'yes' is worthless. Pressure at the close converts a warm maybe into a polite never." },
        ],
      },

    end_win: { speaker: "n", text: "", isEnd: true, endType: "win",
      endMessage: "Sarah went from 'why would I give 48% away?' to scheduling a coffee for her and her co-chair. You did this by honoring her work first, letting the volunteer hour calculation reveal the gap on its own, and tailoring the next conversation to the co-chair's specific motivation (getting her spring back). The DIY comparison is now '$10K net with 200 hours' vs. '$20K+ net with 3 hours' — framed by her own data, not your projections.",
      summary: "With DIY schools: honor the achievement before revealing the gap. Let their own volunteer hour calculation do the reframing. Never position Apex as 'better' — position it as the evolution of what they've already built. And get in front of the co-chair in person." },
    end_mid: { speaker: "n", text: "", isEnd: true, endType: "mid",
      endMessage: "You've opened her eyes to the hidden cost of DIY, but the deal needs to advance to the co-chair in person. Follow up with the time-savings comparison and get both of them in a room.",
      summary: "The insight landed, but the next step needs to be face-to-face with both decision-makers." },
    end_loss: { speaker: "n", text: "", isEnd: true, endType: "loss",
      endMessage: "Sarah is still proud of her $14,000 and feels like you challenged her achievement instead of honoring it. The DIY conversation requires more empathy than any other — because you're not just competing with a product, you're competing with someone's identity as a capable, hands-on leader. Honor first, discover second, reframe last.",
      summary: "DIY schools are the most identity-attached prospects. Challenging their achievement, even implicitly, triggers defensiveness. Lead with genuine admiration, let the math surface naturally, and never make them feel like what they built wasn't good enough." }
  }
);

const S6 = makeScenario(
  "fundraiser", "\"We Already Have a Fundraiser\"", "Riverside Elementary — First Meeting with Principal", "Standard",
  "Mrs. Davidson has been principal for 12 years. Her school does cookie dough sales every fall — parents know the drill. You got this meeting through a PTA mom who raved about Apex at another school. Mrs. Davidson agreed to 'a quick chat' but she's not looking to change anything. She sees 'fundraiser' as a solved problem.",
  "Mrs. Davidson — Loyal, practical, protective of what works. Doesn't like salespeople but respects people who listen. Won't change unless she sees a compelling reason — and 'compelling' means it has to be dramatically better, not just slightly different.",
  ["Positioning as complement, not replacement", "Discovering the latent pain", "The status quo calculation", "Social proof from the Apex network", "Planting the seed for spring"],
  {
    start: { speaker: "them", name: "Mrs. Davidson", text: "Thanks for coming by. Sarah mentioned you, so I wanted to be polite — but I'll be upfront: we're pretty set with our fundraiser. We've done cookie dough sales for six years and the parents know the drill.", options: [
      { text: "I appreciate that — and sounds like you've built something consistent. That matters. Can I ask: what do you like most about how it works for your school?", next: "a1", scores: { empathy: 3, discovery: 3, framing: 0, momentum: 0 }, rating: "excellent",
        feedback: "You validated loyalty, used a genuine appreciation statement (Carnegie), then asked the discovery question that reveals what she values AND where the gaps might be. When she tells you what she likes, she'll also — inevitably — reveal what's merely 'fine.' That 'fine' is where Apex lives.",
        principle: "Rackham's finding: the best salespeople don't pitch. They ask questions that lead the buyer to discover their own need. By asking what she LIKES, you avoid triggering defensiveness — and her answer will contain the seeds of the gap." },
      { text: "I get it! But Apex is actually really different from a cookie dough sale — we're a leadership and character program that happens to raise funds. It's a completely different experience for the school.", next: "b1", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "The differentiation is correct — Apex IS different. But she hasn't told you what she cares about yet, so your pitch is generic, not tailored. She's polite but her guard is still up because you jumped to differentiation before earning the right to.",
        principle: "Challenger Sale: even the best teaching moment needs to be TAILORED. 'We're a character program, not a fundraiser' is the right insight — but delivered before discovery, it's a generic claim. After discovery, it's a targeted reframe." },
      { text: "Makes sense. Roughly how much does it bring in each year? And honestly, the whole thing is completely turnkey on your end — we handle the assembly, the lessons, the prizes, everything.", next: "c1", scores: { empathy: 0, discovery: 1, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "Leading with revenue signals you're here to compete on dollars. She'll get defensive or lowball the number. You just made this transactional before building any trust.",
        principle: "Never lead with money. It commoditizes the conversation immediately and puts you in a price competition instead of a value conversation." }
    ]},
    a1: { speaker: "them", name: "Mrs. Davidson", text: "It's predictable. Parents know what to expect, the PTA runs it, and we don't have to reinvent the wheel every year. [pause] But honestly... participation has been dropping. Last year only about 40% of families bought anything. And my PTA president is pretty burned out from doing all the coordination.", options: [
      { text: "That sounds like a lot on your PTA's shoulders. So if I'm hearing you right — the reliability is great, but the energy around it has been fading and a small group is carrying most of the weight?", next: "a2", scores: { empathy: 3, discovery: 2, framing: 1, momentum: 1 }, rating: "excellent",
        feedback: "Voss labeling: you reflected her situation back at a level deeper than what she said. 'The energy has been fading and a small group is carrying the weight' — this names the trend she's been feeling but hasn't articulated. If she says 'that's right,' her guard drops and the real conversation begins.",
        principle: "Getting to 'That's Right' (Voss): you're not paraphrasing — you're synthesizing. She said 'participation dropping' and 'PTA burned out' as separate complaints. You combined them into a trend statement that names the trajectory. That synthesis is what produces 'that's right' — the moment of feeling deeply understood." },
      { text: "40% participation is pretty common with product sales. Most of our schools see 80-90% because every student participates regardless of donations. And your PTA's total involvement would be about 2-3 hours.", next: "b2", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "The data points are compelling (participation rate, PTA hours), but you skipped past her emotional disclosure. She just admitted vulnerability — the PTA is burning out. Honor that before problem-solving.",
        principle: "There's a moment in every conversation where the right move is to JUST LISTEN — not solve. Solving too fast cheapens the vulnerability they just shared (Salesperson's Mind)." },
      { text: "What if you could keep the cookie dough sale AND add something that re-energizes the school? They work great together — different times of year, totally different experience. Either way, it has to be the right fit for your staff and your students.", next: "a1b", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "Smart complement positioning — and it's less threatening than a replacement pitch. But she just told you her PTA president is burned out. Adding MORE to the plate isn't what she wants to hear right now. Address the burnout first.",
        principle: "Listen for the emotion underneath the objection. She didn't say 'we don't need more fundraisers.' She said 'my people are tired.' Solve THAT problem first." }
    ]},
    a1b: { speaker: "them", name: "Mrs. Davidson", text: "I can't add anything else to my PTA's plate right now. They can barely handle what we've got. If it means more work for them, it's a non-starter.", options: [
      { text: "That makes perfect sense — and honestly, the fact that you're protecting your PTA like that says a lot about you as a leader. Can I show you what the two weeks actually look like for your staff?", next: "a3", scores: { empathy: 2, discovery: 0, framing: 3, momentum: 2 }, rating: "excellent",
        feedback: "You validated her as a leader (sincere appreciation — Carnegie), then delivered the key differentiator (turnkey) directly to her stated pain (PTA burnout). The 'two to three hours' stat lands because she just told you her PTA is at capacity — it's solving HER problem, not pitching a program.",
        principle: "When someone gives you their buying condition ('if it means more work, it's a non-starter'), match it immediately. She told you the condition — 'doesn't add work to PTA.' You met it with '2-3 hours total.' That's condition → match, and it's the fastest path to interest." },
      { text: "With Apex, your PTA literally doesn't have to do anything. We handle every detail. It's truly turnkey. There's no pressure on my end at all. But you know your school better than I do, so I'll follow your lead.", next: "a2", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "'Literally doesn't have to do anything' is an overclaim that analytical principals will push back on. '2-3 hours' is specific and credible. 'Nothing' sounds too good to be true.",
        principle: "Specifics > absolutes. '2-3 hours' is believable. 'Nothing' triggers skepticism. Always use the more specific claim." },
      { text: "I totally understand. What if I checked back in the spring when things calm down? Once you see event day, you'll understand why schools stay with us year after year.", next: "x1", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "Things don't 'calm down' for principals. You'll follow up to a voicemail. The conversation needed to go deeper, not retreat.",
        principle: "Never accept a vague 'later' (Blount). If you can't create value in THIS conversation, a future voicemail won't do it for you." }
    ]},
    a2: { speaker: "them", name: "Mrs. Davidson", text: "Yeah... exactly. It's just fine. And I know 'just fine' isn't great. But changing to something new feels like a risk when we already have something that works, even if it's not exciting anymore.", options: [
      { text: "I hear you — 'just fine' is often the hardest thing to change because it's not broken enough to force a decision. Can I share something I've noticed across schools across our network? But are you building school culture while you do it?", next: "a3", scores: { empathy: 2, discovery: 0, framing: 3, momentum: 1 }, rating: "excellent",
        feedback: "This is a full Challenger teaching moment: you named the status quo trap ('just fine is the hardest to change'), offered an insight about what thriving schools do differently (energy, not just money), and ended with a question that reframes how she evaluates her fundraiser. 'Are you building school culture while you do it?' is the Implication question that makes 'just fine' feel like it's leaving something on the table.",
        principle: "Challenger Sale: the teaching point has four parts — reframe, evidence, implication, solution connection. You hit all four: reframe (it's not about fancy programs), evidence (what thriving schools do), implication (are you building culture?), and the solution connection will come when she answers. Textbook." },
      { text: "That's something I hear a lot — 'it works, but...' Would it help if I shared what a couple of schools across our network did when they were in a similar spot? I'm happy to share details whenever it's useful for you.", next: "a3", scores: { empathy: 2, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
        feedback: "Social proof is a good play here — she might be more moved by peer stories than by your pitch. But you missed the Challenger teaching moment. The question 'are you building school culture while you raise money?' would have changed how she evaluates the status quo.",
        principle: "Social proof works best after you've changed the evaluation criteria. If she's still measuring success by 'does it work?', peer stories about Apex are just interesting. If she's now measuring by 'does it build culture?', peer stories become decisive." },
      { text: "What if we just did a trial run? One event, no long-term commitment. If it's great, you switch. If not, you go back to cookie dough and nothing's lost. Either way, it has to be the right fit for your staff and your students.", next: "a3", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 2 }, rating: "okay",
        feedback: "The trial reduces risk, but it also reduces perceived value. If Apex is 'just try it,' it's a gamble. If Apex is 'the thing that brings school-wide energy,' it's a solution. Frame it as a solution first, offer the trial as a structure.",
        principle: "Never lead with the risk-reduction before you've built the value. The trial offer is a structure, not a value proposition. Build the case first, then offer the trial as the natural next step." }
    ]},
    a3: { speaker: "them", name: "Mrs. Davidson", text: "Building culture... no, we're not doing that. It's transactional — order forms go home, money comes back, and that's it. The kids aren't excited about cookie dough. [pauses] But this is how we've always done it.", options: [
      { text: "And there's value in tradition — I'm not dismissing that. But here's what I'd love for you to see: Sarah at Jefferson — the parent who told you about me — her school was in almost the exact same spot. Would it be worth 20 minutes for me to show you what that looked like?",
        next: "x1", scores: { empathy: 2, discovery: 0, framing: 3, momentum: 3 }, rating: "excellent",
        feedback: "You honored the tradition, then delivered the social proof story with devastating specificity — same situation, same pain, transformative outcome. And the story is about the experience ('best week'), not just the money ($38K). The ask is small (20 minutes), low-pressure ('not to sell you anything'), and framed through the referrer she already trusts (Sarah). This is how you convert 'we've always done it this way.'",
        principle: "Stories beat statistics (Salesperson's Mind). 'Schools raise $35-50K' is a stat. 'Sarah said it was the best week her school had all year' is a story. The story activates the emotional brain, which makes the decision. The stat confirms it afterward. And by using the trusted referrer, you're borrowing credibility you haven't yet earned." },
      { text: "It sounds like cookie dough is solving the money problem but missing the energy problem. What if there were a way to do both at once? There's no pressure on my end at all. But you know your school better than I do, so I'll follow your lead.", next: "x1", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 2 }, rating: "okay",
        feedback: "Good summary reframe and a reasonable next-step offer. But you missed the opportunity to use Sarah's specific story as social proof — which would have been 5x more compelling than a generic offer to 'show you what Apex looks like.'",
        principle: "Specific social proof > general claims. 'A school just like yours' < 'Sarah at Jefferson, the parent who connected us, switched from the exact same situation.' Names, schools, and specific outcomes are what make social proof persuasive." },
      { text: "Yeah, cookie dough sales are pretty outdated. Most schools are moving to experiential fundraisers now. Want me to tell you about the new model? Our online platform makes the whole thing seamless for parents, too. Most schools tell us it's the easiest thing on their calendar all year.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "poor",
        feedback: "You just called her six-year tradition 'outdated.' She already knows it's not exciting — calling it outdated is piling on. And 'the new model' sounds like you're selling a trend, not solving her problem.",
        principle: "Carnegie: never make someone feel stupid for their current choice. 'Outdated' is a judgment that triggers defensiveness, not curiosity. Show the alternative through stories and questions — never by diminishing what they've been doing." }
    ]},
    b1: { speaker: "them", name: "Mrs. Davidson", text: "That sounds nice, but fundraising is really all we need. Our budget got cut again and we need every dollar. I don't have time to evaluate something new.", options: [
      { text: "Budget cuts are tough — and I hear that from almost every principal I talk to. Can I ask: what's the biggest gap right now? Classroom supplies, technology, field trips...?", next: "a2", scores: { empathy: 2, discovery: 3, framing: 0, momentum: 1 }, rating: "excellent",
        feedback: "You empathized with real stress (budget cuts), showed you understand her world, and pivoted to specific discovery. Whatever she answers becomes the way you frame Apex's financial impact — 'That $20K difference funds every field trip for the year.'",
        principle: "Situation questions (SPIN) are most valuable when they're specific. 'What's the biggest gap?' with examples is better than 'tell me about your budget challenges' because it channels the answer toward something actionable." },
      { text: "That's exactly why Apex could be so valuable — our schools typically raise $35K-$50K. Even at 52%, that's significantly more than most fundraisers bring in.", next: "b2", scores: { empathy: 0, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "Revenue comparison without emotional connection. She said 'every dollar counts' and you gave her a number without connecting it to what that money means for her school. The dollar figure needs context to land.",
        principle: "Money needs meaning. '$35K' is a number. '$35K is the difference between field trips happening or not' is a story. Always connect the revenue to what it funds." },
      { text: "I totally understand. What if I just left you a one-pager and followed up in a couple weeks? And honestly, the whole thing is completely turnkey on your end — we handle the assembly, the lessons, the prizes, everything.", next: "x1", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "Retreat. The conversation needed depth, not a brochure. She gave you a real concern (budget cuts) and you responded with paperwork.",
        principle: "When someone shares a real pressure, go deeper — don't retreat. Budget cuts are pain. Pain is the currency of sales (Hormozi). Explore it." }
    ]},
    b2: { speaker: "them", name: "Mrs. Davidson", text: "Look, the numbers sound good. But I can't just switch fundraisers based on a conversation. My PTA president has been running this for three years and I'd need her buy-in.", options: [
      { text: "Absolutely — she should be part of this. What if I set up a quick 20-minute meeting with both of you? I can bring the specifics and she can ask all the questions she needs. No commitment — just information. When would work this week or next?", next: "x1", scores: { empathy: 1, discovery: 0, framing: 1, momentum: 3 }, rating: "excellent",
        feedback: "You respected the PTA president's role, kept the ask small (20 minutes, no commitment), and gave a bounded timeline (this week or next). This is the commitment ladder working — you're not asking for a switch, just a meeting.",
        principle: "Micro-commitments (Cialdini): every small yes makes the next one easier. A 20-minute meeting is a tiny commitment. But it advances the deal more than any email or brochure could." },
      { text: "Of course. Can I send your PTA president some information directly? That way she can evaluate on her own time. I'm happy to share details whenever it's useful for you. Either way, it has to be the right fit for your staff and your students.", next: "x1", scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "okay",
        feedback: "Getting to the PTA president is the right instinct, but sending info is weaker than meeting in person. And going around the principal (even with permission) can feel like you're circumventing the relationship.",
        principle: "Face-to-face beats every other medium. And always position the champion as the introducer, not the bypass." },
      { text: "I hear you. Just think about it and let me know. Here's my card! Once you see event day, you'll understand why schools stay with us year after year. Our online platform makes the whole thing seamless for parents, too.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 0, momentum: 0 }, rating: "poor",
        feedback: "No specific next step. The card goes in a drawer. This deal is dead without a concrete follow-up plan.",
        principle: "Leaving without a next step isn't being respectful — it's giving up. There's always a micro-ask that fits the moment." }
    ]},
    c1: { speaker: "them", name: "Mrs. Davidson", text: "We do fine. Look, I've got a meeting in ten minutes. Is there something specific you wanted to share?", options: [
      { text: "I respect your time. Can I come back for 15 minutes when you have a bit more time?", next: "a1b", scores: { empathy: 2, discovery: 0, framing: 1, momentum: 2 }, rating: "excellent",
        feedback: "Respectful recovery. You dropped local credibility (franchise owner, district name), social proof (a dozen schools including the referrer), and asked for a specific, small follow-up. She may say yes because you stopped selling.",
        principle: "When you've lost the room, stop trying to win it back in the same conversation. Earn the right to come back by showing you respect their time more than you want the sale." },
      { text: "Just one thing — Sarah at Jefferson said her school raised $38,000 with us last spring and it was the best school event they'd ever had. I think Riverside could have that same experience. Here's my card.", next: "x1", scores: { empathy: 1, discovery: 0, framing: 2, momentum: 1 }, rating: "okay",
        feedback: "Social proof from the referrer is smart. But dropping a dollar figure on someone rushing out can feel like a hard sell. The story is better without the number when time is tight.",
        principle: "When time is short, lead with the experience story, not the revenue. 'Best event they'd ever had' > '$38,000' when you haven't earned the money conversation." },
      { text: "Sure — Apex is a fully managed fundraiser and leadership program. Schools keep about 52% and we handle everything for two weeks.", next: "x1", scores: { empathy: 0, discovery: 0, framing: 1, momentum: 0 }, rating: "poor",
        feedback: "A features dump to a disengaged audience. She's mentally in her next meeting. You needed to re-earn her attention, not use her last 30 seconds to pitch.",
        principle: "A disengaged person doesn't need more information — they need a reason to care. Information without context is noise." }
    ]},
      x1: { speaker: "them", name: "Mrs. Davidson",
        text: "Alright, you have my attention. Walk me through the logistics — what does this actually ask of my teachers and my front office?",
        options: [
          { text: "One decision on your end: you approve the dates. From there, my team takes over — we come in, learn your school, your teachers, your students, and work as an extension of your staff for the full two weeks. Every communication piece comes ready to send, parent emails and social posts included. What would make that easiest for your front office?",
            next: "x2", scores: { empathy: 1, discovery: 2, framing: 1, momentum: 1 }, rating: "excellent",
            feedback: "Specific and concrete: one named ask (approve the dates), a clear picture of what the school never touches, and you handed the conversation back with a question. 'Extension of your staff' answers the real worry — that this becomes their project to manage.",
            principle: "Gap Selling: buyers trust specifics. 'Turnkey' is a claim; 'you approve the dates and every parent email comes ready to send' is evidence." },
          { text: "Honestly, almost nothing — we're known for being the easiest thing on a school's calendar. We take care of the details from start to finish, our platform makes everything seamless for families, and you and your staff mostly just get to enjoy the two weeks with your students.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 1, momentum: 1 }, rating: "okay",
            feedback: "Reassuring, but it's all adjectives — easiest, seamless, everything. A skeptical administrator has heard those exact words from every vendor who ever walked in. One concrete detail about what they actually do (and don't do) would have done the convincing for you.",
            principle: "Claims without detail sound like every other pitch. Specificity is what separates confidence from salesmanship." },
          { text: "That's the best part — we take care of absolutely everything. Registration, donations, prize tracking, parent emails, social media content, the event itself, all of it. I can send you our full program guide and a complete feature breakdown tonight so you can see the whole picture for yourself.", next: "x2",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They asked what it costs their people, and you answered with a feature dump and homework — a program guide to read. The question behind the question was 'will this burden my staff,' and it went unanswered while you talked about yourself.",
            principle: "Answer the concern, not the keyword. A feature list is your agenda; their workload was theirs." },
        ],
      },
      x2: { speaker: "them", name: "Mrs. Davidson",
        text: "Okay. I'm not saying yes today. But if we were going to move forward, what would happen next?",
        options: [
          { text: "A 15-minute call next week with you and whoever runs your fundraising — I'll bring a one-page plan with proposed dates and a realistic goal for your school. If it doesn't fit, you've lost 15 minutes and you'll still know exactly what a program here would look like. Does Tuesday or Thursday work better?",
            next: "end_win", scores: { empathy: 1, discovery: 1, framing: 1, momentum: 3 }, rating: "excellent",
            feedback: "A small, concrete, low-risk next step with a built-in choice of times. You made saying yes easier than saying no, and you pulled in the other decision-makers now instead of discovering them three meetings from now.",
            principle: "Momentum lives in specifics: a date, a duration, a deliverable. Vague follow-ups die in inboxes." },
          { text: "I'll email you our information packet and some references from schools in our network, and you can look everything over whenever you have time. I know you've got a lot on your plate, so just reach out whenever you're ready to talk more.", next: "end_mid",
            scores: { empathy: 1, discovery: 0, framing: 0, momentum: 1 }, rating: "okay",
            feedback: "Polite and respectful of their time, but you handed the momentum away. 'Reach out when you're ready' means the next step depends entirely on a busy administrator remembering you exist in three weeks. The door stays open — barely.",
            principle: "Never leave a conversation without a next step that has a name and a date on it." },
          { text: "Well, I'll be honest — our calendar fills up fast this time of year, and most schools lock in their week by the end of the month. I'd hate for you to lose your spot to another school, so the sooner we can get something signed, the better for everyone.", next: "end_loss",
            scores: { empathy: 0, discovery: 0, framing: 0, momentum: 1 }, rating: "poor",
            feedback: "They told you they're not saying yes today, and you answered with a pressure close. Manufactured scarcity right after a trust-building conversation undoes the trust — they hear the tactic, not the deadline. The relationship took the hit.",
            principle: "Voss: a forced 'yes' is worthless. Pressure at the close converts a warm maybe into a polite never." },
        ],
      },

    end_win: { speaker: "n", text: "", isEnd: true, endType: "win",
      endMessage: "Mrs. Davidson went from 'we're set' to agreeing to a follow-up meeting. You did it by leading with curiosity instead of a pitch, letting her discover the gaps in her current approach, and using social proof from a trusted referrer at the right moment. The Challenger teaching moment — 'are you building culture while you raise money?' — changed how she evaluates her fundraiser. Cookie dough raises money. Apex raises funds AND spirits.",
      summary: "With 'we already have a fundraiser' schools: honor the existing program, discover the gaps through questions, and use the Challenger teaching moment to change how they evaluate success. Social proof from a trusted referrer is your most powerful closing tool." },
    end_mid: { speaker: "n", text: "", isEnd: true, endType: "mid",
      endMessage: "You've kept the door open. Follow up with something specific and tailored — not a generic overview. Reference the specific gaps from this conversation and use the referrer's story to build the case.",
      summary: "Door open, but the case for change isn't strong enough yet. Deepen the discovery on the next visit and bring a specific story from a similar school." },
    end_loss: { speaker: "n", text: "", isEnd: true, endType: "loss",
      endMessage: "Cookie dough wins by default because nothing in this conversation gave her a reason to change. Status quo bias is powerful — 'we've always done it this way' requires a genuinely felt gap to overcome. Next time, discover the gap before pitching the solution.",
      summary: "The status quo doesn't need to be good to win — it just needs to be familiar. Your job is to make the gap between 'fine' and 'transformative' feel too big to ignore." }
  }
);

const SCENARIOS = [S6, S1, S2, S3, S4, S5];
const EMAIL_CTX = {
  fundraiser: { to: "Mrs. Davidson", role: "Principal", subject: "Follow-up from our conversation about Riverside's fundraising",
    context: "You met Mrs. Davidson through a PTA parent referral. She does cookie dough sales, participation is declining (40%), PTA president is burned out. You introduced the idea of Apex as a school-culture builder, not just a fundraiser.",
    mustInclude: ["Reference something specific from the conversation (PTA burnout, declining participation, or school culture)", "A specific next step with date/time", "Keep it short and personal — not a corporate pitch"],
    mustAvoid: ["'Just following up'", "'As I mentioned' or 'per our conversation'", "Listing Apex features or revenue numbers", "Sounding like a template"] },
  split: { to: "Mr. Torres", role: "Principal", subject: "The comparison we discussed — Oak Ridge fundraising analysis",
    context: "Mr. Torres is analytical and pushed on the 48% split. You discussed building a net-dollars comparison from Oak Ridge's actual data ($11K raised, ~100 volunteer hours). You committed to sending a one-pager with scenarios at three levels for his PTA treasurer.",
    mustInclude: ["Deliver on the one-pager promise (reference the data)", "Address the treasurer as the next audience", "Offer the peer-to-peer treasurer connection", "Specific follow-up timing"],
    mustAvoid: ["Generic Apex marketing language", "Defensive tone about the 48%", "'Just following up'", "Overloading with attachments"] },
  classroom: { to: "Dr. Chen", role: "Principal", subject: "Flex program sample lesson for Heritage Academy",
    context: "Dr. Chen protects instructional time fiercely. You introduced the Flex program — video-based leadership lessons teachers control. She agreed to review a sample lesson for her leadership team. Her school uses the Positivity Project (PBIS).",
    mustInclude: ["The sample lesson (reference attaching it)", "Connect Superheroes theme to her Positivity Project / PBIS", "Mention teacher control over timing", "Ask what her leadership team will evaluate"],
    mustAvoid: ["Calling it a 'fundraiser'", "Being pushy about scheduling before she's reviewed it", "Generic 'you're going to love it'", "Overexplaining"] },
  outside: { to: "Mrs. Gutierrez", role: "Principal", subject: "Confirming our Thursday meeting — and a reference for you",
    context: "Mrs. Gutierrez had a bad experience with an outside vendor (team didn't show, ran over schedule). You earned a 15-minute follow-up by asking about the bad experience and addressing accountability measures. She agreed to Thursday at 2:00.",
    mustInclude: ["Confirm the specific day/time", "Reference her specific concern (accountability, team reliability)", "Offer the peer principal reference proactively", "Keep it warm but brief"],
    mustAvoid: ["Rehashing the bad experience in too much detail", "Sounding overly enthusiastic or salesy", "Sending attachments she didn't ask for", "'Just wanted to confirm'"] },
  boosterthon: { to: "Jennifer & Principal Martinez", role: "PTA Chair & Principal", subject: "Apex Superheroes sample lesson — the character education piece we discussed",
    context: "Lakewood uses Boosterthon. Jennifer liked the event but felt it was 'corporate.' Principal Martinez said the character education gap was the real differentiator. You promised a sample lesson and overview.",
    mustInclude: ["Address both stakeholders", "The sample lesson attachment", "Connect character education to their school values", "A specific next step"],
    mustAvoid: ["Mentioning Boosterthon by name", "Sending to only one of them", "Being vague about the character education", "Overselling"] },
  diy: { to: "Sarah", role: "PTA President", subject: "The numbers we talked about — and coffee with you and your co-chair",
    context: "Sarah runs a DIY fun run (raised $14K, ~200 volunteer hours). You did the volunteer hour calculation ($4K labor = $10K real net). She needs to talk to her co-chair, who cares about time savings. You're setting up a coffee with both.",
    mustInclude: ["Reference the specific calculation from the conversation", "Propose the coffee meeting with both", "Frame around the co-chair's priority (time savings)", "Keep tone warm — she's a builder"],
    mustAvoid: ["Making her feel like her DIY event wasn't good enough", "Leading with Apex revenue numbers", "'Just following up'", "Being too formal"] }
};

/* ════════════════════════════════════════════════════════════════════
   DRILLS — targeted mini-exercises for weakest principle
   ════════════════════════════════════════════════════════════════════ */
const DRILLS = {
  empathy: [
    { setup: "You're on a drop-by. The PTA president sighs and says:", prompt: "\"I've been at the school until 9 PM three nights this week organizing the spring carnival. And now someone wants me to look at another fundraiser.\"", options: [
      { text: "That's an incredible amount of work — it sounds like you're carrying more than anyone should have to. Before I say anything about what I do, can I ask: is this level of effort sustainable for you?", rating: "excellent", feedback: "You labeled her exhaustion without pitching. The question invites her to confront the sustainability issue herself — tactical empathy + Implication question.", principle: "Labeling + SPIN: name the emotion, then ask a question that makes the problem feel bigger." },
      { text: "I totally get it! That's actually why you'd love Apex — we handle everything so your PTA doesn't have to lift a finger.", rating: "poor", feedback: "You heard exhaustion and responded with a pitch. She needs to feel heard first. 'You'd love Apex' is presumptuous when she hasn't agreed to listen.", principle: "Pitching before empathizing is prescribing before diagnosing." },
      { text: "Wow, that's a lot. How many volunteer hours does your team typically put into these events?", rating: "okay", feedback: "Good discovery instinct, but she shared something emotional and you pivoted to data. Validate first, quantify second.", principle: "Data questions feel cold after emotional disclosures. Validate first." }
    ]},
    { setup: "A principal tells you:", prompt: "\"We tried a fun run company two years ago and it was a disaster. Half their team didn't show up on event day.\"", options: [
      { text: "That sounds like it really put you in a tough spot — and I'm frustrated on your behalf. Can I ask what specifically happened? I'd rather understand your experience than pitch over it.", rating: "excellent", feedback: "Genuine frustration on their behalf + asking for specifics. Her answer becomes your differentiation roadmap.", principle: "When someone shares a bad experience, it's a gift — it tells you exactly what they need to hear." },
      { text: "I'm sorry to hear that. Apex is different — we're a local franchise, and you'd have me as your direct point of contact.", rating: "okay", feedback: "Empathy + differentiation, but you jumped to 'we're different' before understanding what specifically went wrong.", principle: "Differentiate AFTER understanding what you're differentiating from." },
      { text: "Was that Boosterthon? I've heard similar stories.", rating: "poor", feedback: "Never ask who the competitor was or imply their problems are common. It's competitor-bashing disguised as empathy.", principle: "Carnegie: never criticize. Focus on YOUR value." }
    ]},
    { setup: "A treasurer pushes back:", prompt: "\"Look, I just don't see why we'd give 48% away when we can keep everything ourselves.\"", options: [
      { text: "That's a fair concern — and honestly, I'd push on that number too if I were in your seat. Can I ask: when you say 'keep everything,' are you factoring in the volunteer hours, or just the dollar amount?", rating: "excellent", feedback: "You validated her skepticism, positioned yourself on her side, then asked the reframe question. She feels respected, not challenged.", principle: "With analytical objections: validate first, then discover. Never argue — inquire." },
      { text: "I understand. But would you rather keep 90% of $12K or 52% of $45K?", rating: "okay", feedback: "Correct math, but no empathy. Delivered without validation it feels like a gotcha.", principle: "Empathy first unlocks the logical brain. Skip it and even correct math triggers resistance." },
      { text: "48% is very competitive for what we deliver. Let me walk you through what's included.", rating: "poor", feedback: "Defending the price without understanding her concern. 'Very competitive' is corporate language.", principle: "Never defend a price — reframe it." }
    ]}
  ],
  discovery: [
    { setup: "A principal says:", prompt: "\"We're pretty happy with our fundraiser. We've done the same thing for five years.\"", options: [
      { text: "That consistency says a lot — five years of something that works is valuable. What do you like most about how it works for your school?", rating: "excellent", feedback: "You validated loyalty, then asked what she LIKES — which reveals priorities AND where the gaps might be. The gap lives between what she loves and what she tolerates.", principle: "SPIN Situation question: 'What do you like most?' reveals priorities and — inevitably — what's missing." },
      { text: "Five years is a long run! How much does it typically raise?", rating: "okay", feedback: "Revenue questions signal you're competing on dollars. Ask about the experience first.", principle: "Never lead with money. Ask about experience, energy, and effort first." },
      { text: "Have you considered what you might be leaving on the table? Most schools don't realize how much more they could raise.", rating: "poor", feedback: "'Leaving on the table' implies she's making a mistake. She just said she's happy — challenging that triggers Confirmation Bias.", principle: "Never tell a satisfied prospect they're wrong. Let them discover the gap through questions." }
    ]},
    { setup: "A PTA chair says:", prompt: "\"We raised $15,000 with our catalog sale last year. It's fine.\"", options: [
      { text: "That's solid. Can I ask — roughly how many volunteer hours went into coordinating everything? The ordering, distribution, follow-up?", rating: "excellent", feedback: "The volunteer hours question unlocks the hidden cost of 'fine.' Once she calculates it, $15K stops being free. Latent pain → realized pain.", principle: "Gap Selling: understand the current state so deeply that the gap reveals itself." },
      { text: "What would you say is the biggest challenge with it?", rating: "okay", feedback: "Right direction but slightly leading. She might feel defensive. The hours question is more neutral and quantifiable.", principle: "Specific, neutral questions produce better data than open-ended emotional ones." },
      { text: "What if you could raise three times that with zero volunteer work?", rating: "poor", feedback: "You jumped from current state to solution without any discovery. She has no reason to believe your claim.", principle: "SPIN: never jump from Situation to Solution. Build the gap first." }
    ]},
    { setup: "At a lunch & learn, a PTA president says:", prompt: "\"We use Boosterthon and it's been working well. The event day is great.\"", options: [
      { text: "That's great — event day energy really matters. What about the rest of the two weeks? How does the program connect to your school culture beyond the event?", rating: "excellent", feedback: "You validated what they love, then probed the dimension where Apex is strongest. If their character component is surface-level, she'll say so herself.", principle: "Challenger: ask questions that change the evaluation criteria from 'event quality' to 'school culture.'" },
      { text: "What do they charge? We might offer better value.", rating: "poor", feedback: "Price comparison before value establishment. Competing on price against a program she likes feels like an attack.", principle: "Never compete on price when you should compete on value." },
      { text: "Glad it's working! If you ever want to explore other options, keep me in mind.", rating: "okay", feedback: "Polite but passive. You left without learning anything. She told you what's working (event day) which means there's likely something that isn't.", principle: "Every conversation is a discovery opportunity. 'Keep me in mind' is hope disguised as politeness." }
    ]}
  ],
  framing: [
    { setup: "A treasurer pushes back:", prompt: "\"I found a platform where we keep 90% of everything. Why would we use you and lose 48%?\"", options: [
      { text: "She should compare — that's smart. The question is: 90% of what? If that platform raises $12K, that's $10,800 with hundreds of volunteer hours. If Apex raises $40K, that's $21K net with three hours of PTA time. Percentage looks different when the denominators aren't the same.", rating: "excellent", feedback: "You validated the instinct, then delivered the Challenger insight: percentage is only meaningful when bases are comparable. The math does the selling.", principle: "Challenger: '90% of what?' changes the evaluation from percentage-kept to total-net-dollars." },
      { text: "We're not just a platform — we're a two-week program with a team on campus, t-shirts, prizes, events, character education. The 48% covers all of that.", rating: "okay", feedback: "Accurate but defensive — justifying the cost instead of reframing the comparison.", principle: "Don't defend price — reframe the comparison entirely." },
      { text: "Those platforms don't really work — they have low collection rates.", rating: "poor", feedback: "You criticized the alternative without evidence. She'll defend her research instead of considering your point.", principle: "Never attack the alternative. Build your value independently." }
    ]},
    { setup: "A PTA president says:", prompt: "\"We did our own fun run and raised $14K keeping everything. Why give half to you?\"", options: [
      { text: "That's impressive work. Can I add one number? If your team put in 200 hours at $20/hour, that's $4K in donated labor — so the real net is closer to $10K. Apex schools your size net $20K+ with three hours of PTA time. The comparison isn't $14K vs. a split — it's $10K with 200 hours vs. $20K with three.", rating: "excellent", feedback: "You honored the achievement, quantified the hidden cost, then reframed with her own data. The math is devastating because it's built from HER numbers.", principle: "Gap Selling: make the current state's true cost visible. When volunteer hours become labor cost, 'free' stops being free." },
      { text: "$14K is on the low end for schools your size. With Apex, you'd look at $35K-$50K.", rating: "poor", feedback: "You told her $14K isn't good enough. She built this herself — she's proud. Revenue comparison without empathy is criticism.", principle: "Never compare unfavorably to their achievement. Honor first, reframe second." },
      { text: "What if you kept the DIY event and added Apex at a different time? They complement each other well.", rating: "okay", feedback: "Smart complement positioning, but you didn't address her core belief ('we kept everything'). The volunteer hour insight would change how she evaluates both options.", principle: "Complement positioning works after you've reframed the value equation." }
    ]},
    { setup: "A principal says:", prompt: "\"Our cookie dough sale works fine. It raises money and parents know the drill.\"", options: [
      { text: "There's real value in that predictability. But here's what I've noticed: the schools that are thriving aren't just raising money — they're building school culture while they do it. The event becomes the best week of the year. Is that happening for your school right now?", rating: "excellent", feedback: "Challenger teaching moment: you reframed evaluation from 'does it work?' to 'does it build culture?' The question makes her evaluate her fundraiser against a new standard.", principle: "Challenger: change the questions they're asking. When evaluation shifts to 'does it build culture?', cookie dough can't compete." },
      { text: "What if there was a way to raise more AND create an experience kids remember all year?", rating: "okay", feedback: "Future pacing — right direction. But 'what if' is a setup phrase she's heard before. The Challenger insight would change her frame.", principle: "'What if' asks her to imagine. A Challenger insight makes her re-evaluate. The second is more powerful." },
      { text: "Cookie dough sales are pretty outdated. Most schools are moving to experiential fundraisers.", rating: "poor", feedback: "You called her six-year tradition 'outdated.' She'll defend it.", principle: "Carnegie: never make someone feel stupid for their current choice." }
    ]}
  ],
  momentum: [
    { setup: "The conversation went well. She says:", prompt: "\"This all sounds great. Let me think about it and I'll get back to you.\"", options: [
      { text: "Absolutely — what are the main things you want to think through? I might be able to clarify something now, or I can send exactly what you need to make it easier.", rating: "excellent", feedback: "You opened the real conversation — 'what do you want to think about?' surfaces the unvoiced concern. And offering to help positions you as a resource, not a closer.", principle: "Voss: 'think about it' means something didn't land. Open the real conversation, don't accept the vague 'later.'" },
      { text: "Of course! I'll send an email with the details. When's a good time to check back in?", rating: "okay", feedback: "You got a timeline, but didn't uncover what she needs to think about. The follow-up will be generic.", principle: "The question behind 'let me think about it' is the real objection. Uncover it." },
      { text: "Take your time! Here's my card — feel free to reach out whenever.", rating: "poor", feedback: "No next step, no discovery. This deal dies in the 'maybe' pile.", principle: "Blount: never end without a specific next step. 'Whenever' is not a timeline." }
    ]},
    { setup: "After a good meeting, the principal says:", prompt: "\"Send me some information and I'll review it when I get a chance.\"", options: [
      { text: "Happy to — what would be most useful? I'd rather send exactly what helps you decide than bury you with our full kit. And would it make sense to put 15 minutes on the calendar next week to walk through questions together?", rating: "excellent", feedback: "You turned 'send info' into a tailored deliverable + a calendared follow-up. The question 'what would be most useful?' reveals what's on her mind.", principle: "Book a meeting from a meeting. And 'what would be useful?' transforms generic requests into targeted ones." },
      { text: "Will do! I'll send everything today. Would love to follow up next week.", rating: "okay", feedback: "'Everything' is too much. And 'would love to follow up' is vague. Pick a specific day.", principle: "Send the minimum effective information. Propose a specific follow-up date." },
      { text: "Check out our website — apexleadershipco.com. Tons of great info there!", rating: "poor", feedback: "You outsourced your follow-up to her browsing habits. She won't visit.", principle: "Never outsource follow-up to the prospect's initiative." }
    ]},
    { setup: "A PTA chair says:", prompt: "\"I need to run this by our PTA board before we commit.\"", options: [
      { text: "Of course — what do you think their biggest question will be? I can put together something that addresses it directly. And would it help if I came to the meeting, or would you rather present it yourself with me on standby?", rating: "excellent", feedback: "Three power moves: validated the board's role, asked a pre-emptive discovery question, and gave her the CHOICE of how to involve you — empowering her as champion.", principle: "Challenger Customer: champions succeed with tailored tools and autonomy over the process." },
      { text: "Makes sense. When does the board meet? I'll follow up after.", rating: "okay", feedback: "You got a timeline but you're sending her in empty-handed. Arm her with targeted materials.", principle: "Never send your champion into a meeting without tools." },
      { text: "Sure thing! Let me know what they decide.", rating: "poor", feedback: "Zero momentum. You put the deal entirely in someone else's hands with no tools.", principle: "'Let me know what they decide' is the most expensive sentence in sales." }
    ]}
  ]
};

/* ════════════════════════════════════════════════════════════════════
   APP COMPONENT
   ════════════════════════════════════════════════════════════════════ */

/* ═══ rating + outcome helpers ═══ */
const rInk  = r => r==="excellent"?T.good:r==="okay"?T.okay:T.poor;
const rTint = r => r==="excellent"?T.goodTint:r==="okay"?T.okayTint:T.poorTint;
const rL    = r => r==="excellent"?"Strong move":r==="okay"?"Decent — but":"Missed opportunity";
const eInk  = t => t==="win"?T.good:t==="mid"?T.okay:T.poor;
const eL    = t => t==="win"?"Deal advancing":t==="mid"?"Door open, work to do":"Deal stalled";

/* ═══ shared UI pieces ═══ */
const GlobalStyle = () => (
  <style>{`
    @keyframes rise { from { opacity:0; transform:translateY(10px);} to { opacity:1; transform:none;} }
    .rise { animation: rise .4s cubic-bezier(.2,.7,.3,1) both; }
    .rise2 { animation: rise .4s cubic-bezier(.2,.7,.3,1) .07s both; }
    button { font-family: inherit; cursor: pointer; }
    button:focus-visible, textarea:focus-visible { outline: 2px solid ${T.or}; outline-offset: 2px; }
    textarea::placeholder { color: ${T.faint}; }
    @media (prefers-reduced-motion: reduce) { .rise, .rise2 { animation: none; } }
  `}</style>
);

const Kicker = ({ children, color = T.or, style }) => (
  <div style={{ fontFamily: FD, fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color, ...style }}>{children}</div>
);

const Tag = ({ children, ink = T.sub, bg = T.tint }) => (
  <span style={{ fontFamily: FD, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ink, background: bg, padding: "3px 10px", borderRadius: 20 }}>{children}</span>
);

const Btn = ({ children, onClick, primary, blue, disabled, style }) => (
  <button onClick={onClick} disabled={disabled} style={{
    fontFamily: FD, fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
    padding: "13px 22px", borderRadius: 12, transition: "all .18s ease",
    background: primary ? T.or : blue ? T.blue : "transparent",
    color: primary || blue ? "#fff" : T.ink,
    border: primary ? `1px solid ${T.or}` : blue ? `1px solid ${T.blue}` : `1px solid ${T.line}`,
    opacity: disabled ? 0.45 : 1, ...style,
  }}
    onMouseOver={e => { if (disabled) return; e.currentTarget.style.background = primary ? T.orDeep : blue ? T.blueDeep : T.tint; }}
    onMouseOut={e => { e.currentTarget.style.background = primary ? T.or : blue ? T.blue : "transparent"; }}>
    {children}
  </button>
);

const BackLink = ({ onClick, children = "Back" }) => (
  <button onClick={onClick} style={{ background: "none", border: "none", padding: 0, marginBottom: 20, fontFamily: FD, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: T.faint }}>← {children}</button>
);

/* chat bubbles — them left, you right, history always visible */
const TheirLine = ({ name, text, animate }) => (
  <div className={animate ? "rise" : undefined} style={{ margin: "18px 0", maxWidth: "88%" }}>
    <div style={{ fontFamily: FD, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.blueDeep, marginBottom: 5 }}>{name}</div>
    <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: "4px 16px 16px 16px", padding: "13px 16px" }}>
      <p style={{ fontFamily: FS, fontSize: 14.5, lineHeight: 1.65, color: T.ink, margin: 0 }}>{text}</p>
    </div>
  </div>
);

const YourLine = ({ text, animate }) => (
  <div className={animate ? "rise" : undefined} style={{ margin: "14px 0 12px", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
    <div style={{ fontFamily: FD, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.or, marginBottom: 5 }}>You</div>
    <div style={{ background: T.orTint, borderRadius: "16px 4px 16px 16px", padding: "13px 16px", maxWidth: "88%" }}>
      <p style={{ fontFamily: FS, fontSize: 14.5, lineHeight: 1.65, color: T.ink, margin: 0 }}>{text}</p>
    </div>
  </div>
);

const CoachNote = ({ rating, feedback, principle, children, animate }) => (
  <div className={animate ? "rise2" : undefined} style={{ background: T.blueTint, borderLeft: `3px solid ${T.blue}`, borderRadius: 14, padding: "16px 18px", margin: "0 0 22px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
      <Kicker color={T.blueDeep}>Coach's note</Kicker>
      <span style={{ fontFamily: FD, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: rInk(rating) }}>● {rL(rating)}</span>
    </div>
    <p style={{ fontFamily: FS, fontSize: 13.5, lineHeight: 1.65, color: T.ink, margin: "0 0 12px" }}>{feedback}</p>
    <div style={{ borderTop: `1px solid rgba(62,143,204,0.25)`, paddingTop: 10 }}>
      <p style={{ fontFamily: FS, fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: T.sub, margin: 0 }}>{principle}</p>
    </div>
    {children}
  </div>
);

const SkillBadge = ({ k }) => (
  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, background: T.blue, color: "#fff", fontFamily: FD, fontSize: 13, fontWeight: 700 }}>{PRINC[k].name[0]}</span>
);


/* =====================================================================
   USAGE TRACKING (PostHog) — same setup as the Apex Proof Finder
   1) Create a free account at posthog.com (or reuse the Proof Finder's)
   2) Copy your Project API key (starts with "phc_")
   3) Paste it between the quotes below and push the change.
   Leave it empty and the tool still works, just without tracking.
   ===================================================================== */
const POSTHOG_KEY = "";
const POSTHOG_HOST = "https://us.i.posthog.com";

let WHO = null;
try {
  const m = /(?:^|;\s*)apex_user=([^;]+)/.exec(document.cookie || "");
  if (m) WHO = decodeURIComponent(m[1]);
} catch(e) {}

function initAnalytics(){
  if(!POSTHOG_KEY) return;
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init(POSTHOG_KEY,{api_host:POSTHOG_HOST,person_profiles:"identified_only"});
  if(WHO){ posthog.identify(WHO, {franchisee: WHO}); }
}
function track(ev, props){
  try{ if(POSTHOG_KEY && window.posthog) posthog.capture(ev, props||{}); }catch(e){}
}

/* ═══════════════════ APP ═══════════════════ */
export default function App() {
  const [scr, setScr] = useState("menu");
  const [sc, setSc] = useState(null);
  const [nid, setNid] = useState("start");
  const [hist, setHist] = useState([]);
  const [coach, setCoach] = useState(false);
  const [last, setLast] = useState(null);
  const [ts, setTs] = useState({empathy:0,discovery:0,framing:0,momentum:0});
  const [ms, setMs] = useState({empathy:0,discovery:0,framing:0,momentum:0});
  const [done, setDone] = useState([]);
  const [intro, setIntro] = useState(true);
  const ref = useRef(null);
  const [emailText, setEmailText] = useState("");
  const [emailFb, setEmailFb] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [drillSkill, setDrillSkill] = useState(null);
  const [drillIdx, setDrillIdx] = useState(0);
  const [drillAnswer, setDrillAnswer] = useState(null);
  const [drillDismissed, setDrillDismissed] = useState(false);
  const [cumScores, setCumScores] = useState(null);
  const [user, setUser] = useState(null);
  const [runSalt, setRunSalt] = useState("s0");
  const [drillSalt, setDrillSalt] = useState("d0");

  // Identity comes from the apex_user cookie set by /api/auth (middleware gates access).
  useEffect(() => {
    const m = /(?:^|;\s*)apex_user=([^;]+)/.exec(document.cookie || "");
    if (m) { try { setUser({ email: decodeURIComponent(m[1]) }); } catch (e) {} }
    initAnalytics();
    track("tool_opened");
  }, []);

  useEffect(() => { try { const r = localStorage.getItem("apex-trainer-scores"); if(r) setCumScores(JSON.parse(r)); } catch(e){} }, []);

  const saveCum = async (newTs, newMs) => {
    const p = cumScores || {empathy:{t:0,m:0},discovery:{t:0,m:0},framing:{t:0,m:0},momentum:{t:0,m:0},runs:0};
    const u = {...p, runs:p.runs+1};
    Object.keys(PRINC).forEach(k => { u[k] = {t:(p[k]?.t||0)+(newTs[k]||0), m:(p[k]?.m||0)+(newMs[k]||0)}; });
    setCumScores(u);
    try { localStorage.setItem("apex-trainer-scores", JSON.stringify(u)); } catch(e){}
  };

  const weakest = () => {
    if(!cumScores||cumScores.runs<1) return null;
    let w=null, wp=101;
    Object.keys(PRINC).forEach(k => { const s=cumScores[k]; if(s&&s.m>0){const p=Math.round(s.t/s.m*100); if(p<wp){wp=p;w=k;}} });
    return wp<75?w:null;
  };

  useEffect(() => { ref.current?.scrollIntoView({behavior:"smooth"}) }, [hist.length, coach, emailFb, drillAnswer]);

  const go = s => { track("scenario_started",{scenario:s.title,difficulty:s.difficulty});setRunSalt(Math.random().toString(36).slice(2));setSc(s);setNid("start");setHist([]);setCoach(false);setLast(null);setTs({empathy:0,discovery:0,framing:0,momentum:0});setMs({empathy:0,discovery:0,framing:0,momentum:0});setEmailText("");setEmailFb(null);setScr("brief"); };
  const pick = (o,opts) => {
    const b={}; Object.keys(PRINC).forEach(k=>{b[k]=Math.max(...opts.map(x=>x.scores[k]||0))});
    setTs(p=>{const n={...p};Object.keys(o.scores).forEach(k=>n[k]+=o.scores[k]);return n});
    setMs(p=>{const n={...p};Object.keys(b).forEach(k=>n[k]+=b[k]);return n});
    track("choice_made",{scenario:sc.title,node:nid,rating:o.rating});setHist(p=>[...p,{nid,text:o.text,...o}]);setLast(o);setCoach(true);
  };
  const adv = () => { setCoach(false);setNid(last.next); };
  const fin = () => { track("scenario_completed",{scenario:sc.title,score:og()}); if(!done.includes(sc.id))setDone(p=>[...p,sc.id]); saveCum(ts,ms); setScr("debrief"); };
  const node = sc?sc.nodes[nid]:null;
  const shuffled = useMemo(
    () => (sc && node && node.options) ? shuffleOpts(node.options, runSalt + sc.id + nid) : [],
    [sc, nid, node, runSalt]
  );
  const sp = k => ms[k]===0?0:Math.round(ts[k]/ms[k]*100);
  const og = () => { const t=Object.values(ts).reduce((a,b)=>a+b,0),m=Object.values(ms).reduce((a,b)=>a+b,0);return m===0?0:Math.round(t/m*100)};

  const evalEmail = async () => {
    if(!emailText.trim()||emailLoading) return;
    setEmailLoading(true); setEmailFb(null);
    const ctx = EMAIL_CTX[sc.id];
    const prompt = `You are a sales coaching expert evaluating a follow-up email written by an Apex Leadership Co. franchise owner after a sales conversation.

SCENARIO: ${ctx.context}
RECIPIENT: ${ctx.to} (${ctx.role})

THE EMAIL MUST: ${ctx.mustInclude.join("; ")}
THE EMAIL MUST AVOID: ${ctx.mustAvoid.join("; ")}

ALSO EVALUATE: Does it add specific value (not just "checking in")? Reference something personal? Include a concrete next step? Sound like a real person? Stay under 150 words? Lead with value for THEM?

THE EMAIL:
${emailText}

Respond ONLY with JSON (no markdown/backticks): {"score":0-100,"grade":"A/B/C/D","strengths":["..."],"improvements":["..."],"rewrite":"Model email under 120 words"}`;
    try {
      const resp = await fetch("/api/evaluate-email", {
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt})
      });
      if(resp.status===401){ window.location.href="/login.html"; return; }
      const data = await resp.json();
      if(data.error) throw new Error(data.error);
      track("email_submitted",{scenario:sc.title,grade:data.grade,score:data.score});
      setEmailFb(data);
    } catch(e) { setEmailFb({score:0,grade:"?",strengths:["Could not evaluate — try again"],improvements:[],rewrite:""}); }
    setEmailLoading(false);
  };

  const startDrill = (skill) => { track("drill_started",{skill}); setDrillSalt(Math.random().toString(36).slice(2)); setDrillSkill(skill); setDrillIdx(Math.floor(Math.random()*DRILLS[skill].length)); setDrillAnswer(null); setScr("drill"); };

  const Page = ({ children, wide }) => (
    <div style={{ background: T.page, minHeight: "100vh", padding: "28px 20px 80px", fontFamily: FD }}>
      <GlobalStyle />
      <div style={{ maxWidth: wide ? 720 : 640, margin: "0 auto" }}>{children}</div>
    </div>
  );

  /* ═══ COVER ═══ */
  if (intro) return (
    <div style={{ background: T.page, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: FD }}>
      <GlobalStyle />
      <div style={{ maxWidth: 600, textAlign: "center" }} className="rise">
        <Kicker style={{ marginBottom: 16 }}>Apex Leadership Co · Field Training</Kicker>
        <h1 style={{ fontFamily: FD, fontWeight: 600, fontSize: "clamp(40px, 8vw, 56px)", lineHeight: 1.05, letterSpacing: "0.01em", color: T.ink, margin: "0 0 14px", textTransform: "uppercase" }}>
          The Objection<br/>Playbook
        </h1>
        <p style={{ fontFamily: FS, fontSize: 15.5, lineHeight: 1.6, color: T.sub, margin: "0 auto 32px", maxWidth: 440 }}>
          Six school conversations. Every line you choose, coached in real time — straight from the Apex Sales Playbook.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32, textAlign: "left" }}>
          {Object.entries(PRINC).map(([k, p]) => (
            <div key={k} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 14, padding: "13px 14px", display: "flex", gap: 11, alignItems: "flex-start" }}>
              <SkillBadge k={k} />
              <div>
                <div style={{ fontFamily: FD, fontSize: 14, fontWeight: 600, color: T.ink }}>{p.name}</div>
                <div style={{ fontFamily: FS, fontSize: 11.5, lineHeight: 1.45, color: T.faint, marginTop: 2 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <Btn primary onClick={() => setIntro(false)} style={{ padding: "15px 44px" }}>Start training</Btn>
      </div>
    </div>
  );

  /* ═══ MENU ═══ */
  if (scr === "menu") { const weak = weakest(); return (
    <Page wide>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26 }}>
        <div>
          <Kicker style={{ marginBottom: 4 }}>The Objection Playbook</Kicker>
          <h2 style={{ fontFamily: FD, fontWeight: 600, fontSize: 28, color: T.ink, margin: 0 }}>Six Situations</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: FD, fontSize: 13, fontWeight: 600, color: T.faint }}>{done.length} / {SCENARIOS.length} complete</div>
          <button onClick={async () => { track("signed_out"); try { await fetch("/api/logout", { method: "POST" }); } catch(e){} window.location.href = "/login.html"; }} style={{ background: "none", border: "none", padding: 0, fontFamily: FS, fontSize: 11, color: T.faint, textDecoration: "underline", marginTop: 3, cursor: "pointer" }}>{user?.email ? user.email + " · " : ""}Sign out</button>
        </div>
      </div>

      {weak && !drillDismissed && cumScores && (
        <div className="rise" style={{ background: T.blueTint, border: `1px solid ${T.blue}`, borderRadius: 16, padding: "18px 20px", marginBottom: 18 }}>
          <Kicker color={T.blueDeep} style={{ marginBottom: 8 }}>Coach's call</Kicker>
          <p style={{ fontFamily: FS, fontSize: 14.5, lineHeight: 1.55, color: T.ink, margin: "0 0 4px" }}>
            Your <strong>{PRINC[weak].name}</strong> is at {Math.round(cumScores[weak].t/cumScores[weak].m*100)}% across {cumScores.runs} scenario{cumScores.runs>1?"s":""}.
          </p>
          <p style={{ fontFamily: FS, fontSize: 13, lineHeight: 1.5, color: T.sub, margin: "0 0 14px" }}>{PRINC[weak].desc}. A 60-second drill sharpens it.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn blue onClick={() => startDrill(weak)} style={{ padding: "10px 18px", fontSize: 13 }}>Run the drill</Btn>
            <Btn onClick={() => setDrillDismissed(true)} style={{ padding: "10px 18px", fontSize: 13 }}>Skip</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SCENARIOS.map(s => { const d = done.includes(s.id); return (
          <button key={s.id} onClick={() => go(s)} style={{
            background: T.panel, border: `1px solid ${T.line}`, borderRadius: 16, padding: "18px 20px",
            textAlign: "left", transition: "all .18s ease",
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(22,33,43,0.08)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <Tag ink={s.difficulty === "Advanced" ? T.orDeep : T.blueDeep} bg={s.difficulty === "Advanced" ? T.orTint : T.blueTint}>{s.difficulty}</Tag>
              {d && <Tag ink={T.good} bg={T.goodTint}>✓ Complete</Tag>}
            </div>
            <div style={{ fontFamily: FD, fontWeight: 600, fontSize: 19, color: T.ink, marginBottom: 3 }}>{s.title}</div>
            <div style={{ fontFamily: FS, fontSize: 13, color: T.sub, marginBottom: 8 }}>{s.subtitle}</div>
            <div style={{ fontFamily: FS, fontSize: 11, fontWeight: 500, color: T.faint }}>{s.teaches.join("  ·  ")}</div>
          </button>
        )})}
      </div>
    </Page>
  );}

  /* ═══ DRILL ═══ */
  if (scr === "drill" && drillSkill) {
    const drill = DRILLS[drillSkill][drillIdx];
    const shD = shuffleOpts(drill.options, drillSalt + drillSkill + drillIdx);
    return (
      <Page>
        <BackLink onClick={() => { setScr("menu"); setDrillDismissed(true); }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <SkillBadge k={drillSkill} />
          <div>
            <Kicker style={{ marginBottom: 2 }}>Skill drill</Kicker>
            <div style={{ fontFamily: FD, fontWeight: 600, fontSize: 22, color: T.ink }}>{PRINC[drillSkill].name}</div>
          </div>
        </div>
        <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 16, padding: "18px 20px", marginBottom: 18 }}>
          <p style={{ fontFamily: FS, fontSize: 12.5, color: T.faint, margin: "0 0 8px" }}>{drill.setup}</p>
          <p style={{ fontFamily: FS, fontSize: 15.5, lineHeight: 1.65, color: T.ink, margin: 0 }}>{drill.prompt}</p>
        </div>

        {!drillAnswer && (
          <div>
            <Kicker color={T.faint} style={{ marginBottom: 10 }}>Choose your line</Kicker>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {shD.map((o, i) => (
                <button key={o._origIdx} onClick={() => { track("drill_answered",{skill:drillSkill,rating:o.rating}); setDrillAnswer(o); }} style={{
                  background: T.panel, border: `1px solid ${T.line}`, borderRadius: 14, padding: "14px 16px",
                  textAlign: "left", display: "flex", gap: 13, transition: "all .18s ease",
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = T.or; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.transform = "none"; }}>
                  <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: T.or, lineHeight: 1.5 }}>{String.fromCharCode(65 + i)}</span>
                  <span style={{ fontFamily: FS, fontSize: 14, lineHeight: 1.6, color: T.ink }}>{o.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {drillAnswer && (
          <div>
            <YourLine text={drillAnswer.text} animate />
            <CoachNote rating={drillAnswer.rating} feedback={drillAnswer.feedback} principle={drillAnswer.principle} animate />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => startDrill(drillSkill)} style={{ flex: 1 }}>Another drill</Btn>
              <Btn primary onClick={() => { setScr("menu"); setDrillDismissed(true); }} style={{ flex: 1 }}>Back to scenarios</Btn>
            </div>
          </div>
        )}
        <div ref={ref} />
      </Page>
    );
  }

  /* ═══ BRIEFING ═══ */
  if (scr === "brief") return (
    <Page>
      <BackLink onClick={() => setScr("menu")} />
      <Kicker style={{ marginBottom: 4 }}>Case briefing</Kicker>
      <h2 style={{ fontFamily: FD, fontWeight: 600, fontSize: 28, color: T.ink, margin: "0 0 4px" }}>{sc.title}</h2>
      <p style={{ fontFamily: FS, fontSize: 14, color: T.sub, margin: "0 0 24px" }}>{sc.subtitle}</p>

      {[["The situation", sc.setting], ["Who you're facing", sc.persona]].map(([h, body], i) => (
        <div key={i} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 16, padding: "16px 20px", marginBottom: 12 }}>
          <Kicker color={T.blueDeep} style={{ marginBottom: 8 }}>{h}</Kicker>
          <p style={{ fontFamily: FS, fontSize: 14, lineHeight: 1.68, color: T.ink, margin: 0 }}>{body}</p>
        </div>
      ))}
      <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 16, padding: "16px 20px", marginBottom: 24 }}>
        <Kicker color={T.blueDeep} style={{ marginBottom: 10 }}>What this teaches</Kicker>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {sc.teaches.map((t, i) => <Tag key={i} ink={T.blueDeep} bg={T.blueTint}>{t}</Tag>)}
        </div>
      </div>
      <Btn primary onClick={() => setScr("play")} style={{ width: "100%", padding: "16px 0" }}>Enter the conversation</Btn>
    </Page>
  );

  /* ═══ PLAY ═══ */
  if (scr === "play" && node) {
    const isEnd = node.isEnd;
    return (
      <div style={{ background: T.page, minHeight: "100vh", fontFamily: FD }}>
        <GlobalStyle />
        <div style={{ background: "rgba(246,249,251,0.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${T.line}`, padding: "12px 20px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: FD, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sc.title}</span>
            <span style={{ fontFamily: FD, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", color: T.faint, whiteSpace: "nowrap" }}>
              {Object.entries(PRINC).map(([k, v], i) => <span key={k}>{i > 0 && "  ·  "}{v.short} <span style={{ color: T.blueDeep }}>{ts[k]}</span></span>)}
            </span>
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "10px 20px 120px" }}>
          {hist.map((h, i) => { const hn = sc.nodes[h.nid]; return (
            <div key={i}>
              {hn && hn.speaker === "them" && <TheirLine name={hn.name} text={hn.text} />}
              <YourLine text={h.text} />
              <CoachNote rating={h.rating} feedback={h.feedback} principle={h.principle} />
            </div>
          )})}

          {!isEnd && !coach && node.speaker === "them" && <TheirLine name={node.name} text={node.text} animate />}

          {coach && last && (
            <div>
              {node.speaker === "them" && <TheirLine name={node.name} text={node.text} />}
              <YourLine text={last.text} animate />
              <CoachNote rating={last.rating} feedback={last.feedback} principle={last.principle} animate>
                <div style={{ marginTop: 14 }}>
                  {sc.nodes[last.next]?.isEnd
                    ? <Btn primary onClick={() => { adv(); setTimeout(fin, 50); }} style={{ width: "100%" }}>See results</Btn>
                    : <Btn blue onClick={adv} style={{ width: "100%" }}>Continue the conversation</Btn>}
                </div>
              </CoachNote>
            </div>
          )}

          {!isEnd && !coach && node.options && (
            <div style={{ marginTop: 24 }}>
              <Kicker color={T.faint} style={{ marginBottom: 10 }}>Choose your line</Kicker>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {shuffled.map((o, i) => (
                  <button key={o._origIdx} onClick={() => pick(o, node.options)} style={{
                    background: T.panel, border: `1px solid ${T.line}`, borderRadius: 14, padding: "14px 16px",
                    textAlign: "left", display: "flex", gap: 13, transition: "all .18s ease",
                  }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = T.or; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(22,33,43,0.08)"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                    <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: T.or, lineHeight: 1.5 }}>{String.fromCharCode(65 + i)}</span>
                    <span style={{ fontFamily: FS, fontSize: 14, lineHeight: 1.6, color: T.ink }}>{o.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isEnd && (
            <div className="rise" style={{ background: T.panel, border: `1px solid ${T.line}`, borderLeft: `3px solid ${eInk(node.endType)}`, borderRadius: 16, padding: "18px 20px", marginTop: 10 }}>
              <Kicker color={eInk(node.endType)} style={{ marginBottom: 10 }}>Outcome — {eL(node.endType)}</Kicker>
              <p style={{ fontFamily: FS, fontSize: 14.5, lineHeight: 1.68, color: T.ink, margin: "0 0 12px" }}>{node.endMessage}</p>
              <p style={{ fontFamily: FS, fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: T.sub, margin: 0, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>{node.summary}</p>
              <Btn primary onClick={fin} style={{ width: "100%", marginTop: 16 }}>View full debrief</Btn>
            </div>
          )}
          <div ref={ref} />
        </div>
      </div>
    );
  }

  /* ═══ DEBRIEF ═══ */
  if (scr === "debrief") {
    const g = og(); const lh = hist[hist.length - 1]; const fn = lh ? sc.nodes[lh.next] : null;
    return (
      <Page>
        <Kicker style={{ marginBottom: 4 }}>Debrief</Kicker>
        <h2 style={{ fontFamily: FD, fontWeight: 600, fontSize: 25, color: T.ink, margin: "0 0 20px" }}>{sc.title}</h2>

        <div className="rise" style={{ marginBottom: 24 }}>
          <span style={{ fontFamily: FD, fontWeight: 600, fontSize: 72, color: T.ink, lineHeight: 1 }}>{g}</span>
          <span style={{ fontFamily: FD, fontWeight: 600, fontSize: 20, color: T.faint }}> /100</span>
          <div style={{ width: 58, height: 4, background: T.or, borderRadius: 2, marginTop: 8 }} />
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 16, padding: "16px 20px", marginBottom: 14 }}>
          <Kicker color={T.blueDeep} style={{ marginBottom: 14 }}>Skill breakdown</Kicker>
          {Object.entries(PRINC).map(([k, v]) => { const p = sp(k); return (
            <div key={k} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontFamily: FD, fontSize: 13.5, fontWeight: 600, color: T.ink }}>{v.name}</span>
                <span style={{ fontFamily: FS, fontSize: 12, fontWeight: 500, color: T.faint }}>{ts[k]}/{ms[k]} · {p}%</span>
              </div>
              <div style={{ height: 6, background: T.tint, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p}%`, background: T.blue, borderRadius: 3, transition: "width .6s ease" }} />
              </div>
            </div>
          )})}
        </div>

        {fn && fn.isEnd && (
          <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderLeft: `3px solid ${eInk(fn.endType)}`, borderRadius: 16, padding: "15px 20px", marginBottom: 14 }}>
            <Kicker color={eInk(fn.endType)} style={{ marginBottom: 8 }}>Outcome — {eL(fn.endType)}</Kicker>
            <p style={{ fontFamily: FS, fontSize: 13.5, lineHeight: 1.62, color: T.ink, margin: 0 }}>{fn.summary}</p>
          </div>
        )}

        <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 16, padding: "16px 20px", marginBottom: 14 }}>
          <Kicker color={T.blueDeep} style={{ marginBottom: 12 }}>What each choice taught</Kicker>
          {hist.map((h, i) => (
            <div key={i} style={{ borderTop: i > 0 ? `1px solid ${T.line}` : "none", padding: i > 0 ? "12px 0 0" : 0, marginTop: i > 0 ? 12 : 0 }}>
              <Tag ink={rInk(h.rating)} bg={rTint(h.rating)}>Choice {i + 1} · {rL(h.rating)}</Tag>
              <p style={{ fontFamily: FS, fontStyle: "italic", fontSize: 12.5, lineHeight: 1.6, color: T.sub, margin: "8px 0 0" }}>{h.principle}</p>
            </div>
          ))}
        </div>

        {EMAIL_CTX[sc.id] && (
          <button onClick={() => { setEmailText(""); setEmailFb(null); setScr("email"); }} style={{
            background: T.or, border: "none", borderRadius: 16, padding: "18px 20px", marginBottom: 14,
            width: "100%", textAlign: "left", transition: "all .18s ease", boxShadow: "0 4px 14px rgba(244,124,53,0.35)",
          }}
            onMouseOver={e => { e.currentTarget.style.background = T.orDeep; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseOut={e => { e.currentTarget.style.background = T.or; e.currentTarget.style.transform = "none"; }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
              <div>
                <div style={{ fontFamily: FD, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", marginBottom: 5 }}>Next step · Bonus round</div>
                <div style={{ fontFamily: FD, fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 3 }}>✉ Practice the Follow-Up Email</div>
                <div style={{ fontFamily: FS, fontSize: 12.5, lineHeight: 1.5, color: "rgba(255,255,255,0.9)" }}>Write your email to {EMAIL_CTX[sc.id].to} — the coach grades it and shows you a model version.</div>
              </div>
              <span style={{ fontFamily: FD, fontSize: 26, fontWeight: 600, color: "#fff", flexShrink: 0 }}>→</span>
            </div>
          </button>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => go(sc)} style={{ flex: 1 }}>Retry</Btn>
          <Btn blue onClick={() => { setScr("menu"); setSc(null); setDrillDismissed(false); }} style={{ flex: 1 }}>Choose another</Btn>
        </div>
      </Page>
    );
  }

  /* ═══ EMAIL PRACTICE ═══ */
  if (scr === "email" && sc && EMAIL_CTX[sc.id]) {
    const ctx = EMAIL_CTX[sc.id];
    return (
      <Page>
        <BackLink onClick={() => setScr("debrief")}>Back to debrief</BackLink>
        <Kicker style={{ marginBottom: 4 }}>Follow-up email practice</Kicker>
        <h2 style={{ fontFamily: FD, fontWeight: 600, fontSize: 24, color: T.ink, margin: "0 0 2px" }}>To: {ctx.to}</h2>
        <p style={{ fontFamily: FS, fontSize: 13, color: T.sub, margin: "0 0 16px" }}>{ctx.role}</p>
        <div style={{ background: T.blueTint, borderLeft: `3px solid ${T.blue}`, borderRadius: 14, padding: "14px 18px", marginBottom: 18 }}>
          <p style={{ fontFamily: FS, fontSize: 13.5, lineHeight: 1.65, color: T.ink, margin: 0 }}>{ctx.context}</p>
        </div>

        <textarea value={emailText} onChange={e => setEmailText(e.target.value)}
          placeholder={`Subject: ${ctx.subject}\n\nHi ${ctx.to.split(" ")[0]},\n\nWrite your follow-up here...`}
          style={{
            width: "100%", minHeight: 220, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 14,
            padding: 16, fontFamily: FS, fontSize: 14, lineHeight: 1.7, color: T.ink, resize: "vertical", boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = T.or}
          onBlur={e => e.target.style.borderColor = T.line} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0 22px" }}>
          <span style={{ fontFamily: FS, fontSize: 12, fontWeight: 500, color: T.faint }}>{emailText.trim().split(/\s+/).filter(Boolean).length} words</span>
          <Btn primary onClick={evalEmail} disabled={emailLoading || !emailText.trim()}>{emailLoading ? "Coach is reading…" : "Get coached"}</Btn>
        </div>

        {emailFb && (
          <div className="rise">
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
              <span style={{ fontFamily: FD, fontWeight: 600, fontSize: 54, color: T.ink, lineHeight: 1 }}>{emailFb.grade}</span>
              <span style={{ fontFamily: FS, fontSize: 14, fontWeight: 600, color: T.faint }}>{emailFb.score}/100</span>
            </div>
            {emailFb.strengths?.length > 0 && (
              <div style={{ background: T.goodTint, borderLeft: `3px solid ${T.good}`, borderRadius: 12, padding: "13px 16px", marginBottom: 12 }}>
                <Kicker color={T.good} style={{ marginBottom: 8 }}>What landed</Kicker>
                {emailFb.strengths.map((s, i) => <p key={i} style={{ fontFamily: FS, fontSize: 13, lineHeight: 1.6, color: T.ink, margin: i > 0 ? "7px 0 0" : 0 }}>· {s}</p>)}
              </div>
            )}
            {emailFb.improvements?.length > 0 && (
              <div style={{ background: T.okayTint, borderLeft: `3px solid ${T.okay}`, borderRadius: 12, padding: "13px 16px", marginBottom: 12 }}>
                <Kicker color={T.okay} style={{ marginBottom: 8 }}>Tighten this</Kicker>
                {emailFb.improvements.map((s, i) => <p key={i} style={{ fontFamily: FS, fontSize: 13, lineHeight: 1.6, color: T.ink, margin: i > 0 ? "7px 0 0" : 0 }}>· {s}</p>)}
              </div>
            )}
            {emailFb.rewrite && (
              <div style={{ background: T.blueTint, borderLeft: `3px solid ${T.blue}`, borderRadius: 14, padding: "16px 18px", marginBottom: 18 }}>
                <Kicker color={T.blueDeep} style={{ marginBottom: 10 }}>Coach's rewrite</Kicker>
                <p style={{ fontFamily: FS, fontSize: 13.5, lineHeight: 1.75, color: T.ink, margin: 0, whiteSpace: "pre-wrap" }}>{emailFb.rewrite}</p>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => setScr("debrief")} style={{ flex: 1 }}>Back to debrief</Btn>
          <Btn onClick={() => { setEmailText(""); setEmailFb(null); }} style={{ flex: 1 }}>Start over</Btn>
        </div>
        <div ref={ref} />
      </Page>
    );
  }

  return null;
}
