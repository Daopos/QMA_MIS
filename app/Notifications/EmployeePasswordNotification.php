<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class EmployeePasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $employee;
    protected $password;

    public function __construct($employee, $password)
    {
        $this->employee = $employee;
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
                $message->to($this->employee->email)
                    ->from('noreply@gmail.com', 'Qma Log In Information')
                    ->subject('Your Employee Account Login Information');
            }
        );
    }

    protected function buildMessage()
    {
        return "Hello  " . $this->employee->fname ."\n\n" . // Assuming 'name' is the guardian's full name
        "Your employee account has been created. Here are your login details:\n\n" .
        "Email: " . $this->employee->email . "\n" .
        "Password: " . $this->password . "\n\n" .
        "Please activate your account before logging in.\n\n" .
        "If you did not request this account, please contact the registrar's office immediately.\n\n" .
        "Thank you for joining us!";
    }
}
