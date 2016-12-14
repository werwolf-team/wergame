from django.db import models
import datetime

class User(models.Model):
    UName = models.CharField(max_length = 20)
    UPassword = models.CharField(max_length = 20)
    UEmail = models.CharField(max_length = 20)
    USex = models.BooleanField()
    UOnline = models.BooleanField()
    UDate = models.CharField(max_length = 40)
    UAvatar = models.PositiveIntegerField()
    URoom = models.CharField(max_length = 40)
    UOrder = models.PositiveIntegerField()
    UReady = models.BooleanField()
    URole = models.PositiveIntegerField()
    UAlive = models.BooleanField()

class Room(models.Model):
    RName = models.CharField(max_length = 20)
    RPassword = models.CharField(max_length = 20)
    RType = models.PositiveIntegerField()
    RCreator = models.CharField(max_length = 40)
    #RPlayer1 = models.PositiveIntegerField()
    RTimer = models.PositiveIntegerField()
    #RP1Ready = models.BooleanField()
    RGaming = models.BooleanField()
    RGamer = models.PositiveIntegerField()
    RDays = models.PositiveIntegerField()
    RPolice = models.PositiveIntegerField()
    RConfig = models.PositiveIntegerField()

class Message(models.Model):
     MRoom = models.CharField(max_length = 40)
     MUser = models.CharField(max_length = 40)
     MType = models.PositiveIntegerField()
     MText = models.CharField(max_length = 200)
     MPath = models.CharField(max_length = 200)
     MDate = models.DateTimeField(default = datetime.datetime.now())
