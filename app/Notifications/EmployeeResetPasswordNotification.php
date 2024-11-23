<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class EmployeeResetPasswordNotification extends Notification
{
    use Queueable;

    protected $employee;
    protected $password;
    protected $loginUrl;

    public function __construct($employee, $password, $loginUrl)
    {
        $this->employee = $employee;
        $this->password = $password;
        $this->loginUrl = $loginUrl;
    }

    public function via($notifiable)
    {
        // Empty array since we're sending a raw email
        return [];
    }

    public function sendResetPasswordNotification()
    {
        // Create a plain text email
        Mail::raw(
            $this->buildMessage(),
            function ($message) {
                $message->to($this->employee->email) // Use the employee's email
                    ->from('noreply@gmail.com', 'Qma Password Reset') // From the specified sender
                    ->subject('Your Employee Account Password Has Been Reset');
            }
        );
    }

    protected function buildMessage()
    {
        return "Hello " . $this->employee->firstname . ",\n\n" .
        "Your employee account password has been reset by the admin. Here are your new login details:\n\n" .
        "Username: " . $this->employee->username . "\n" .
        "New Password: " . $this->password . "\n\n" .
        "You can now log in to your account using the following link: " . $this->loginUrl . "\n\n" .
        "If you did not request this change, please contact the admin immediately.\n\n" .
        "Thank you!";
    }
}