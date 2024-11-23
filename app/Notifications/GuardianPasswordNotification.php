<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class GuardianPasswordNotification extends Notification
{
    use Queueable;

    protected $guardian;
    protected $password;

    public function __construct($guardian, $password)
    {
        $this->guardian = $guardian;
        $this->password = $password;
    }

    public function via($notifiable)
    {
        // Empty array since we're sending a raw email
        return [];
    }

    public function sendPasswordNotification()
    {
        // Create a plain text email
        Mail::raw(
            $this->buildMessage(),
            function ($message) {
                $message->to($this->guardian->email)
                    ->from('noreply@gmail.com', 'Qma Log In Information')
                    ->subject('Your Guardian Account Login Information');
            }
        );
    }

    protected function buildMessage()
    {
        return "Hello\n\n" . // Assuming 'name' is the guardian's full name
        "Your guardian account has been created. Here are your login details:\n\n" .
        "Username: " . $this->guardian->username . "\n" .
        "Password: " . $this->password . "\n\n" .
        "Please activate your account before logging in.\n\n" .
        "If you did not request this account, please contact the registrar's office immediately.\n\n" .
        "Thank you for joining us!";
    }
}
