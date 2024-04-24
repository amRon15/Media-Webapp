from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    username = forms.CharField(max_length=10, help_text='Required. 10 characters or fewer. Letters and digits only.')
    password1 = forms.CharField(widget=forms.PasswordInput, min_length=8, max_length=16, label='Password')
    password2 = forms.CharField(widget=forms.PasswordInput, min_length=8, max_length=16, label='Confirm Password')

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not username.isalnum():
            raise forms.ValidationError('The username should only contain letters and digits.')
        if User.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError('This username is already in use.')
        return username
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not ('@' in email and email.endswith('.com')):
            raise forms.ValidationError('Invalid email address. The email should contain "@" and end with ".com".')
        return email

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match.")

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user