// Supabase Edge Function: send-email
// Sends email via Resend API
// Accepts: { to, subject, html }

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST.' }, null, 2),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    // Parse request body
    const body = await req.json();
    const { to, subject, html } = body;

    // Validate required fields
    if (!to) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: to' }, null, 2),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    if (!subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: subject' }, null, 2),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    if (!html) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: html' }, null, 2),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }, null, 2),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Get environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(
        JSON.stringify(
          {
            error: 'RESEND_API_KEY not configured in Supabase secrets',
          },
          null,
          2
        ),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const fromEmail =
      Deno.env.get('RESEND_FROM_EMAIL') || 'hello@todotomorrow.com';

    // Call Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    // Parse Resend response
    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      // Resend API returned an error
      return new Response(
        JSON.stringify(
          {
            error: 'Resend API error',
            details: resendData.error || resendData.message || 'Unknown error',
          },
          null,
          2
        ),
        {
          status: resendResponse.status >= 500 ? 500 : 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Success - return message ID from Resend response
    return new Response(
      JSON.stringify(
        {
          success: true,
          messageId: resendData.id,
          to: to,
          subject: subject,
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    // Handle unexpected errors
    return new Response(
      JSON.stringify(
        {
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});

