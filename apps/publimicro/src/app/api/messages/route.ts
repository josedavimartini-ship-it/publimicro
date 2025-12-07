import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // Check if user is verified
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('verified, phone_verified, email_verified')
      .eq('id', user.id)
      .single();

    if (!profile?.verified && !profile?.phone_verified) {
      return NextResponse.json(
        { error: 'Please verify your account before sending messages' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      receiver_id, 
      item_id, 
      item_type, 
      item_title, 
      message 
    } = body;

    // Validate required fields
    if (!receiver_id || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prevent self-messaging
    if (receiver_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot send message to yourself' },
        { status: 400 }
      );
    }

    // Create or get conversation
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1.eq.${user.id},participant_2.eq.${receiver_id}),and(participant_1.eq.${receiver_id},participant_2.eq.${user.id})`)
      .eq('item_id', item_id)
      .single();

    let conversationId: string;

    if (existingConversation) {
      conversationId = existingConversation.id;
    } else {
      // Create new conversation
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: receiver_id,
          item_id,
          item_type,
          item_title,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }

      conversationId = newConversation.id;
    }

    // Insert message
    const { data: newMessage, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        receiver_id,
        content: message.trim(),
        item_id,
        item_type,
        read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (msgError) {
      console.error('Error sending message:', msgError);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ 
        last_message_at: new Date().toISOString(),
        last_message_preview: message.trim().substring(0, 100)
      })
      .eq('id', conversationId);

    // TODO: Send push notification to receiver
    // await sendPushNotification(receiver_id, {
    //   title: 'Nova mensagem',
    //   body: `${profile.full_name}: ${message.substring(0, 50)}...`,
    //   data: { conversation_id: conversationId }
    // });

    return NextResponse.json({
      success: true,
      message: newMessage,
      conversation_id: conversationId
    });

  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation_id');

    if (conversationId) {
      // Get messages for specific conversation
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!sender_id(id, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
      }

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', user.id)
        .eq('read', false);

      return NextResponse.json({ messages });
    } else {
      // Get all conversations for user
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1_profile:user_profiles!participant_1(id, full_name, avatar_url),
          participant_2_profile:user_profiles!participant_2(id, full_name, avatar_url),
          unread_count:messages(count)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
      }

      return NextResponse.json({ conversations });
    }

  } catch (error) {
    console.error('Messages GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
