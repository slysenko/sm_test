import type { Message, MessageContent } from '@/types/messages'

const textMessages = [
  'Hi, could you help me with something?',
  "Sure, I'd be happy to help! What do you need?",
  "I'm looking to book a table for two this Saturday at 7:00 PM.",
  'Let me check the availability for you.',
  'Thank you so much!',
  'Do they have vegetarian options?',
  'Yes, they have an excellent selection of vegetarian dishes.',
  "That's great to hear!",
  'Can you please confirm the reservation under my name?',
  "I'll need your full name and phone number for the reservation.",
  'My name is Sarah Johnson and my number is 555-0123.',
  'Perfect! Your reservation is confirmed.',
  'Is there parking nearby?',
  "Yes, there's a parking lot right behind the restaurant.",
  "You've been so helpful. Looking forward to it!",
  "You're welcome! Feel free to reach out if you need anything else.",
  'What time do they close on weekdays?',
  'They close at 10 PM on weekdays and 11 PM on weekends.',
  'Do you have any special events coming up?',
  'Yes, they have live music every Friday night!',
  'That sounds amazing! What kind of music?',
  'Usually jazz and acoustic performances.',
  'Is there a dress code?',
  'Smart casual is recommended, but not strictly enforced.',
  'Good to know, thanks!',
  'Can I make changes to my reservation later?',
  'Yes, just call them at least 24 hours in advance.',
  'Perfect, I appreciate all your help!',
  'Happy to assist! Enjoy your meal!',
  'Do they offer takeout as well?',
  'Yes, they have a full takeout menu available.',
  'Great! I might order from there during the week.',
  'They also have delivery through major apps.',
  'Even better! What are their most popular dishes?',
  'The pasta carbonara and the grilled salmon are customer favorites.',
  "I love salmon! I'll definitely try that.",
  "You won't be disappointed!",
  'Do they have a website I can check out?',
  'Yes, I can share the link with you.',
  'That would be wonderful, thank you!',
  'Is the restaurant family-friendly?',
  'Absolutely! They have a kids menu too.',
  'Perfect for my family then!',
  'They also have high chairs available if needed.',
  "You've thought of everything!",
  'Just trying to be helpful!',
  'Do they accept credit cards?',
  'Yes, all major credit cards are accepted.',
  'And do they have outdoor seating?',
  'Yes, they have a lovely patio area.',
  'Sounds perfect for the summer!',
  'It really is a great spot.',
  'Thanks again for all the information!',
  'Anytime! Have a great day!',
  "What's their signature dish?",
  "The chef's special risotto is exceptional.",
  "I'll make sure to try it!",
  "You'll love it, I guarantee it!",
  'Do they cater to dietary restrictions?',
  "Yes, they're very accommodating with allergies and dietary needs.",
  "That's reassuring to know.",
]

const imageUrls = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop',
]

const imageCaptions = [
  'Look at this amazing dish!',
  "Here's what I tried last time",
  'The presentation is beautiful',
  'This is the restaurant I mentioned',
  'Check out this dessert!',
  'The ambiance is lovely',
  'Their signature dish looks like this',
  'Fresh ingredients every day',
]

export function generateMockMessages(count: number, startId: number = 1): Message[] {
  const messages: Message[] = []
  const baseDate = new Date('02/10/2023 10:18')

  for (let i = 0; i < count; i++) {
    const messageId = startId + i
    const isOutgoing = i % 3 === 1
    const isImage = i % 7 === 0

    const minutesAgo = (count - i) * 15
    const timestamp = new Date(baseDate.getTime() - minutesAgo * 60000)

    let content: MessageContent

    if (isImage) {
      const imageIndex = i % imageUrls.length
      content = {
        type: 'image',
        imageUrl: imageUrls[imageIndex]!,
        caption: imageCaptions[imageIndex],
      }
    } else {
      const textIndex = i % textMessages.length
      content = {
        type: 'text',
        text: textMessages[textIndex]!,
      }
    }

    messages.push({
      id: messageId,
      content,
      isOutgoing,
      isDelivered: true,
      timestamp,
      channel: 'WhatsApp',
    })
  }

  return messages
}

export const allMockMessages = generateMockMessages(80)
