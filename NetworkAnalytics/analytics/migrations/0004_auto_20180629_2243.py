# Generated by Django 2.0.6 on 2018-06-29 17:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0003_auto_20180629_1700'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataupload',
            name='upload_file',
            field=models.FileField(upload_to='', verbose_name='static/'),
        ),
    ]
