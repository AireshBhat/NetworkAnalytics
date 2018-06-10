from django.forms import forms


class DataUploadForm(forms.Form):
    upload_file = forms.FileField()
