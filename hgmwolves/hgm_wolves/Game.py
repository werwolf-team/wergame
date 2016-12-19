from django.shortcuts import *
from django.http import *
from hgm_wolves.models import *
import math, random
from datetime import *

global nowspeak
global flag2
global flag1
global words
global tmpvote
tmpvote = 1 << 12 - 1
nowspeak = 0
words = 0
flag1 = False
flag2 = False


def getRoomPlayers(request):
    try:
        p = Room.objects.GET(RName = request.GET['rName'])
    except Room.DoesNotExist:
        name_dict = {'str': '-1'}
        return JsonResponse(name_dict)
    else:
        list = []
        for i in range(1, 13):
            try:
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
            except User.DoesNotExist:
                continue
            else:
                 name_dict = [tmp.UOrder, tmp.UName, tmp.UAvatar]
                 list.append(name_dict)
        return JsonResponse({'players': list})

def ready(request):
    try:
        p = Room.objects.get(RName = request.GET['rName'])
    except Room.DoesNotExist:
        name_dict = {'str': '0'}
        return JsonResponse(name_dict)
    else:
        username =  request.COOKIES.get('username', '')
        temp = User.objects.get(UName = username)
        temp.UReady = True
        temp.save()
        name_dict = {'str': '1'}
        return JsonResponse(name_dict)

def GetReadyStatus(request):
    try:
        p = Room.objects.get(RName = request.GET['rName'])
    except Room.DoesNotExist:
        name_dict = {'str': '0'}
        return JsonResponse(name_dict)
    else:
        num = 0
        list = []
        for i in range(1, 13):
            try:
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
            except User.DoesNotExist:
                continue
            else:
                if tmp.UReady:
                    num = num + 1
                    list.append({'name': tmp.UName, 'avatar':tmp.UAvatar,'status': 1})
                else:
                    list.append({'name': tmp.UName, 'avatar':tmp.UAvatar, 'status': 0})
        if (num == 12) and (p.RGaming == False):
            GameStart(p.RName)
        name_dict = {'str': list}
        return JsonResponse(name_dict)

def getRole(request):
    tmp = User.objects.get(UName = request.GET['myName'])
    name_dict = {'str': tmp.URole}
    return JsonResponse(name_dict)

def GameStart(rName):
    p = Room.objects.get(RName = rName)
    num = 0
    f1 = True
    f2 = True
    f3 = True
    f4 = True
    wolf = 4
    guy = 4
    random.seed()
    for i in range(1, 13):
        tmp = User.objects.get(URoom = p.RName, UOrder = i)
        flag = False
        while not flag:
            x = ran(6)
            if x == 1:
                if f1:
                    flag = True
                    tmp.URole = 1
                    f1 = False
            elif x == 2:
                if f2:
                    flag = True
                    tmp.URole = 2
                    f2 = False
            elif x == 3:
                if f3:
                    flag = True
                    tmp.URole = 3
                    f3 = False
            elif x == 4:
                if f4:
                    flag = True
                    tmp.URole = 4
                    f4 = False
            elif x == 5:
                if wolf > 0:
                    flag = True
                    tmp.URole = 5
                    wolf = wolf - 1
            else:
                if guy > 0:
                    flag = True
                    tmp.URole = 6
                    guy = guy - 1
        tmp.save()
    p.RGaming = True
    p.RNow = 1
    p.RDays = 1
    p.RPolice = 0
    p.RPoison = True
    p.RSave = True
    s = str(datetime.now().strftime("%Y%m%d%H%I%S"))
    p.RTimer = (((int(s[6:8])) * 24 + int(s[8:10])) * 60 + int(s[10:12])) * 60 + int(s[12:14])
    p.save()
    for i in range(1, 13):
        tmp = User.objects.get(URoom = p.RName, UOrder = i)
        if tmp.URole == 3:
            p.RVote = 1 << (i - 1)
            break

def getGameStatus(request):
    try:
        tmp = User.objects.get(UName = request.GET['myName'])
    except User.DoesNotExist:
        name_dict = {'str': '-1'}
        return JsonResponse(name_dict)
    else:
        p = Room.objects.get(RName = tmp.URoom)
        list = []
        for i in range(1, 13):
            try:
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
            except User.DoesNotExist:
                continue
            else:
                x = 0
                y = 0
                if tmp.UAlive:
                    x = 1
                if p.RPolice == i:
                    y = 1
                list.append({'livestatus': x, 'policestatus': y})
        _time = Timer(p.RName)
        name_dict = {'nowStatus': p.RNow, 'nowTime': _time, 'res': list}
        return JsonResponse(name_dict)

def setvote(request):
    tmp = User.objects.get(UName = request.GET['myName'])
    p = Room.objects.get(RName = tmp.URoom)
    id = tmp.UOrder
    if tmp.UAlive == False:
        name_dict = {'str': '0'}
        return JsonResponse(name_dict)
    if p.RVote & (1 << (id - 1)) == 0:
        name_dict = {'str': '0'}
        return JsonResponse(name_dict)
    if tmp.UVote > 0:
        name_dict = {'str': '0'}
        return JsonResponse(name_dict)
    if User.objects.get(URoom = request.get['myRoom'], UOrder = request.get['id']).UAlive == False:
        name_dict = {'str': '0'}
        return JsonResponse(name_dict)
    tmp.UVote = request['id']
    tmp.save()
    name_dict = {'str': '1'}
    return JsonResponse(name_dict)

def clearvote(rName):
    p = Room.objects.get(RName = rName)
    for i in range(1, 13):
        tmp = User.objects.get(URoom = p.RName, UOrder = i)
        tmp.UVote = 0
        tmp.save()

def newMessage(id, room, right, str):
    temp = Message(MRoom = room)
    if id > 0:
        temp.MUser = User.objects.get(URoom = room, UOrder = id).UName
    else:
        temp.MUser = '系统'
    temp.MText = str
    temp.MRight = right
    temp.MPath = ''
    temp.MType = 0
    temp.MDate = datetime.now()
    temp.save()

def receiveMessage(request):
    try:
        tmp = User.objects.get(UName = request.GET['myName'])
    except User.DoesNotExist:
        name_dict = {'str': '0'}
        return JsonResponse(name_dict)
    else:
        if tmp.UAlive == False:
            name_dict = {'str': '0'}
            return JsonResponse(name_dict)
        p = Room.objects.get(RName = tmp.URoom)
        id = tmp.UOrder
        x = 1 << (id - 1)
        if (x & p.RSpeak) == 0:
            name_dict = {'str': '0'}
            return JsonResponse(name_dict)
        if p.RNow == 3:
            right = 0
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 5:
                    right = right + 1 << (i - 1)
        else:
            right = 1 << 12 - 1
        newMessage(id, p.RName, right, request.get['str'])
        name_dict = {'str': '1'}
        return JsonResponse(name_dict)

def getMessage(request):
    tmp = User.objects.get(UName = request.GET['myName'])
    Mess = Message.objects.filter(MRoom = tmp.URoom)
    list = []
    for i in Mess:
        if (i.MRight & (1 << (tmp.UOrder - 1))) > 0:
            list.append({'user': i.MUser, 'time': i.MDate, 'content': i.MText})
            i.MRight = i.MRight - 1 << (tmp.UOrder - 1)
    return JsonResponse({'Messages': list})

def ran(n):
    return math.floor(random.random() * n) + 1

def loverDie(rName):
    p = Room.objects.get(RName = rName)
    dead2 = p.RDead / 100
    dead1 = p.RDead % 100
    if dead2 == 0:
        if User.objects.get(URoom = rName, UOrder = dead1).ULover:
            for i in range(1, 13):
                if (User.objects.get(URoom = p.RName, UOrder = i).ULover == True) and (i != dead1):
                    p.RDead = p.RDead * 100 + i
    elif (User.objects.get(URoom = rName, UOrder = dead1).ULover == True) or (User.objects.get(URoom = rName, UOrder = dead2).ULover == True):
        for i in range(1, 13):
            if (User.objects.get(URoom = p.RName, UOrder = i).ULover == True) and (i != dead1) and (i != dead2):
                p.RDead = p.RDead * 100 + i

def sendlastword(request):
    tmp = User.objects.get(UName = request.get['myName'])
    p = Room.objects.get(RName = tmp.URoom)
    if p.RWords == 4:
        name_dict = {'str': '0'}
        return JsonResponse(name_dict)
    p.RWords = p.RWords + 1
    p.save()
    newMessage(tmp.UOrder, p.RName, 1 << 12 - 1, str(tmp.UOrder) +  '号遗言：' + request.get['content'])

def gameEnd(rName):
    p = Room.objects.get(RName = rName)
    for i in range(1, 13):
        tmp = User.objects.get(URoom = rName)
        tmp.ULover = False
        tmp.UOrder = 0
        tmp.URole = 0
        tmp.UVote = 0
        tmp.UAlive = True
        tmp.UReady = False
        tmp.save()
    p.RDays = 0
    p.RVote = 0
    p.RGaming = False
    p.RPolice = 0
    p.RWords = 0
    p.RDead = 0
    p.RLast = 0
    p.RNow = 0
    p.RSpeak = 0
    p.save()

def isVictory(rName):
    flag = False
    flag3 = False
    p = Room.objects.get(RName = rName)
    for i in range(1, 13):
        tmp = User.objects.get(URoom = p.RName, UOrder = i)
        if tmp.ULover:
            for j in range(i + 1, 13):
                tp = User.objects.get(URoom = p.RName, UOrder = j)
                if tp.ULover:
                    if ((tmp.URole == 5) and (tp.URole != 5)) or ((tp.URole == 5) and (tmp.URole != 5)):
                        flag3 = True
                    break
            break
    if flag3:
        flag = True
        for i in range(1, 13):
            tmp = User.objects.get(URoom = p.RName, UOrder = i)
            if (tmp.ULover == False) and (tmp.URole != 3):
                flag = False
                break
        if flag:
            newMessage(0, rName, 1 << 12 - 1, '人狼恋胜利！')
            gameEnd(rName)
    if p.RType == 0:
        flag = True
        for i in range(1, 13):
            tmp = User.objects.get(URoom = p.RName, UOrder = i)
            if tmp.URole != 5:
                flag = False
                break
        if flag:
            newMessage(0, rName, 1 << 12 - 1, '狼人胜利！')
            gameEnd(rName)
    flag = True
    for i in range(1, 13):
        tmp = User.objects.get(URoom = p.RName, UOrder = i)
        if tmp.URole != 5:
            flag = False
            break
    if flag:
        newMessage(0, rName, 1 << 12 - 1, '人类胜利！')
        gameEnd(rName)
    if p.RType == 1:
        flag = True
        for i in range(1, 13):
            tmp = User.objects.get(URoom = p.RName, UOrder = i)
            if (tmp.URole == 6) or (flag3 and tmp.ULover and tmp.UAlive):
                flag = False
                break
        if flag:
            newMessage(0, rName, 1 << 12 - 1, '狼人胜利！')
            gameEnd(rName)
        flag = True
        for i in range(1, 13):
            tmp = User.objects.get(URoom = p.RName, UOrder = i)
            if ((tmp.URole != 5) and (tmp.URole != 6)) or (flag3 and tmp.ULover and tmp.UAlive):
                flag = False
                break
        if flag:
            newMessage(0, rName, 1 << 12 - 1, '狼人胜利！')
            gameEnd(rName)

def Timer(rName):
    p = Room.objects.get(RName = rName)
    s = str(datetime.now().strftime("%Y%m%d%H%I%S"))
    now = (((int(s[6:8])) * 24 + int(s[8:10])) * 60 + int(s[10:12])) * 60 + int(s[12:14])
    time = now - p.RTimer
    global nowspeak
    global flag2
    global flag1
    global words
    global tmpvote
    rest = 0
    if p.RNow == 1:
        if time > 10:
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 3:
                    if tmp.UVote == 0:
                        tmp.UVote = ran(12)
                    tp = User.objects.get(URoom = p.RName, UOrder = tmp.UVote)
                    tp.ULover = True
                    tp.save()
                    break
            p.RNow = 2
            p.RTimer = now
            clearvote(rName)
        rest = 10 - time
        p.save()
    elif p.RNow == 2:
        if time > 10:
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 3:
                    if tmp.UVote == 0:
                        tmp.UVote = ran(12)
                        while User.objects.get(URoom = p.RName, UOrder = tmp.UVote).ULover == True:
                            tmp.UVote = ran(12)
                    tp = User.objects.get(URoom = p.RName, UOrder = tmp.UVote)
                    tp.ULover = True
                    tp.save()
                    break
            p.RNow = 3
            p.RVote = 0
            p.RSpeak = 0
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 5:
                    p.RVote = p.RVote + 1 << (i - 1)
                    p.RSpeak = p.RSpeak + 1 << (i - 1)
            p.RTimer = now
            clearvote(rName)
        rest = 10 - time
        p.save()
    elif p.RNow == 3:
        if time > 30:
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 5:
                    if tmp.UVote > 0:
                        if p.RDead == 0:
                            p.RDead = tmp.UVote
                        elif p.RDead != tmp.UVote:
                            p.RDead = -1
            if p.RDead == -1:
                p.RDead = 0
            p.RNow = 4
            p.RVote = 0
            p.RSpeak = 0
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 2:
                    p.RVote = p.RVote + 1 << (i - 1)
            p.RTimer = now

            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 2:
                    if p.RDead > 0:
                        newMessage(0, rName, 1 << (i - 1), '今天晚上' + str(p.RDead) + '号被杀了')
                    else:
                        newMessage(0, rName, 1 << (i - 1), '今天晚上没有人被杀')
                    break
            clearvote(rName)
        rest = 30 - time
        p.save()


    elif p.RNow == 4:
        if time > 10:
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 2:
                    if tmp.UVote == 1:
                        if p.RSave == False:
                            newMessage(0, rName, 1 << (i - 1), '您没有解药')
                        elif p.RDead == 0:
                            newMessage(0, rName, 1 << (i - 1), '今晚没有人被杀')
                        else:
                            p.RDead = 0
                            p.RSave = False
                    break
            p.RNow = 5
            p.RTimer = now
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 2:
                    newMessage(0, rName, 1 << (i - 1), '请选择您要毒杀的玩家')
            clearvote(rName)
        rest = 10 - time
        p.save()
    elif p.RNow == 5:
        if time > 10:
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 2:
                    if tmp.UVote > 0:
                        p.RPoison = False
                        if tmp.UVote != p.RDead:
                            p.RDead = p.RDead * 100 + tmp.UVote
            p.RNow = 6
            if p.RDead != 0:
                loverDie(rName)
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 1:
                    p.RVote = 1 << (i - 1)
                    newMessage(0, rName, 1 << (i - 1), '请查看一个人的身份')
                    break
            clearvote(rName)
            p.RTimer = now
        rest = 10 - time
        p.save()
    elif p.RNow == 6:
        if time > 10:
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 1:
                    if tmp.UVote > 0:
                        if User.objects.get(URoom = rName, UOrder = tmp.UVote).URole == 5:
                            newMessage(0, rName, 1 << (i - 1), str(tmp.UVote) + '号玩家的身份是狼人')
                        else:
                            newMessage(0, rName, 1 << (i - 1), str(tmp.UVote) + '号玩家的身份是人类')
            if p.RDays == 1:
                p.RNow = 7
                p.RVote = 1 << 12 - 1
                p.RTimer = now
                clearvote(rName)
            else:
                if p.RDead != 0:
                    words = p.RDead
                    while words != 0:
                        hunter = 0
                        newMessage(0, rName, 1 << 12 - 1, str(words % 100) + '号玩家昨天晚上死了')
                        User.objects.get(URoom = rName, UOrder = words % 100).UAlive = False
                        if User.objects.get(URoom = rName, UOrder = words % 100).URole == 4:
                            flag1 = True
                            hunter = words % 100
                        if words % 100 == p.RPolice:
                            flag2 = True
                        words = words / 100
                    isVictory(rName)
                    p.RDead = 0
                    if flag1:
                        p.RLast = 9
                        p.RNow = 13
                        p.RSpeak = 0
                        p.RVote = 1 << (hunter - 1)
                        newMessage(0, rName, 1 << 12 - 1, str(hunter) + '号玩家是猎人，请发动技能')
                elif flag2:
                    p.RLast = 9
                    p.RNow = 14
                    p.RSpeak = 0
                    p.RVote = 1 << (p.RPolice - 1)
                    User.objects.get(URoom = p.RName, UOrder = p.RPolice).UAlive = True
                    User.objects.get(URoom = p.RName, UOrder = p.RPolice).save()
                    newMessage(0, rName, 1 << 12 - 1, str(p.RPolice) + '号玩家是警长，请传递警徽')
                else:
                    p.RNow = 10
                    p.RSpeak = 0
                    p.RVote = 1 << (p.RPolice - 1)
                    p.RVote = 0
                p.RTimer = now
                clearvote(rName)
        rest = 10 - time
        p.save()
    elif p.RNow == 7:
        if time > 10:
            nowspeak = 0
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.UVote == i:
                    nowspeak = i
                    newMessage(0, rName, 1 << 12 - 1, str(i) + '号玩家发表竞选宣言')
                    p.RSpeak = 1 << (i - 1)
                    tmpvote = tmpvote - p.RSpeak
                    tmp.UVote = 0
                    tmp.save()
                    break
            if nowspeak == 0:
                nowspeak = ran(12)
            p.RNow = 8
            p.RVote = 0
            p.RTimer = now
        rest = 10 - time
        p.save()
    elif p.RNow == 8:
        if (nowspeak != 0) and (time > 30):
            nowspeak = 0
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.UVote == i:
                    nowspeak = i
                    newMessage(0, rName, 1 << 12 - 1, str(i) + '号玩家发表竞选宣言')
                    p.RSpeak = 1 << (i - 1)
                    tmpvote = tmpvote - p.RSpeak
                    tmp.UVote = 0
                    tmp.save()
                    break
            if nowspeak == 0:
                p.RSpeak = 0
            p.RTimer = now
        elif nowspeak == 0:
            p.RNow = 9
            p.RSpeak = 0
            p.RVote = tmpvote
            p.Timer = now
        rest = 30 - time
        p.save()
    elif p.RNow == 9:
        if time > 10:
            list=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if (tmp.UVote > 0) and (p.RVote & (1 << (tmp.UVote - 1)) == 0):
                    list[tmp.UVote] = list[tmp.UVote] + 1
            nnow = 1
            for i in range(2, 13):
                if list[i] > list[nnow]:
                    nnow = i
                if p.RVote & (1 << (i - 1)) == 0:
                    newMessage(0, rName, 1 << 12 - 1, str(i) + '号玩家:' + str(list[i]) + '票')
            p.RPolice = nnow
            newMessage(0, rName, 1 << 12 - 1, str(nnow) + '号玩家当选警长！')
            if p.RDead != 0:
                words = p.RDead
                while words != 0:
                    hunter = 0
                    newMessage(0, rName, 1 << 12 - 1, str(words % 100) + '号玩家昨天晚上死了')
                    User.objects.get(URoom = rName, UOrder = words % 100).UAlive = False
                    if User.objects.get(URoom = rName, UOrder = words % 100).URole == 4:
                        flag1 = True
                        hunter = words % 100
                    if words % 100 == p.RPolice:
                        flag2 = True
                    words = words / 100
                isVictory(rName)
                p.RDead = 0
                if flag1:
                    p.RLast = 9
                    p.RNow = 13
                    p.RSpeak = 0
                    p.RVote = 1 << (hunter - 1)
                    newMessage(0, rName, 1 << 12 - 1, str(hunter) + '号玩家是猎人，请发动技能')
            elif flag2:
                p.RLast = 9
                p.RNow = 14
                p.RSpeak = 0
                p.RVote = 1 << (p.RPolice - 1)
                User.objects.get(URoom = p.RName, UOrder = p.RPolice).UAlive = True
                User.objects.get(URoom = p.RName, UOrder = p.RPolice).save()
                newMessage(0, rName, 1 << 12 - 1, str(p.RPolice) + '号玩家是警长，请传递警徽')
            else:
                p.RNow = 10
                p.RSpeak = 0
                p.RVote = 1 << (p.RPolice - 1)
                p.RVote = 0
            p.RTimer = now
            clearvote(rName)
        rest = 10 - time
        p.save()
    elif p.RNow == 10:
        if time > 10:
            p.RNow = 11
            p.RVote = 0
            words = User.objects.get(URoom = p.RName, UOrder = p.RPolice).UVote
            if words == 1:
                nowspeak = 0
                for i in range(p.RPolice - 1, 0, -1):
                    if User.objects.get(URoom = p.RName, UOrder = i).UAlive:
                        nowspeak = i
                        p.RSpeak = 1 << (i - 1)
                        break
                if nowspeak == 0:
                    for i in range(12, p.RPolice - 1, -1):
                        if User.objects.get(URoom = p.RName, UOrder = i).UAlive:
                            nowspeak = i
                            p.RSpeak = 1 << (i - 1)
                            break
            else:
                nowspeak = 0
                for i in range(p.RPolice + 1, 13):
                    if User.objects.get(URoom = p.RName, UOrder = i).UAlive:
                        nowspeak = i
                        p.RSpeak = 1 << (i - 1)
                        break
                if nowspeak == 0:
                    for i in range(1, p.RPolice + 1):
                        if User.objects.get(URoom = p.RName, UOrder = i).UAlive:
                            nowspeak = i
                            p.RSpeak = 1 << (i - 1)
                            break
            p.RTimer = time
        rest = 10 - time
        p.save()
    elif p.RNow == 11:
        if time > 30:
            if nowspeak != p.RPolice:
                tmp = User.objects.get(URoom = p.RName, UOrder = p.RPolice)
                if tmp.UVote == 1:
                    flag = False
                    for i in range(nowspeak - 1, 0, -1):
                        if User.objects.get(URoom = p.RName, UOrder = i).UAlive:
                            nowspeak = i
                            p.RSpeak = 1 << (i - 1)
                            flag = True
                            break
                    if flag == False:
                        for i in range(12, p.RPolice - 1, -1):
                            if User.objects.get(URoom = p.RName, UOrder = i).UAlive:
                                nowspeak = i
                                p.RSpeak = 1 << (i - 1)
                                break
                else:
                    flag = False
                    for i in range(nowspeak + 1, 13):
                        if User.objects.get(URoom = p.RName, UOrder = i).UAlive:
                            nowspeak = i
                            p.RSpeak = 1 << (i - 1)
                            flag = True
                            break
                    if flag == False:
                        for i in range(1, p.RPolice + 1):
                            if User.objects.get(URoom = p.RName, UOrder = i).UAlive:
                                nowspeak = i
                                p.RSpeak = 1 << (i - 1)
                                break
            else:
                p.RNow = 12
                p.RVote = 1 << 12 - 1
                p.RSpeak = 0
                clearvote(rName)
            p.RTimer = now
        rest = 30 - time
        p.save()
    elif p.RNow == 12:
        if time > 10:
            list=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.UVote > 0:
                    if i == p.RPolice:
                        list[tmp.UVote] = list[tmp.UVote] + 2
                    else:
                        list[tmp.UVote] = list[tmp.UVote] + 1
            nnow = 0
            for i in range(1, 13):
                if list[i] > list[nnow]:
                    flag = True
                    nnow = i
                elif list[i] == list[nnow]:
                    flag = False
                if p.RVote & (1 << (i - 1)) == 0:
                    newMessage(0, rName, 1 << 12 - 1, str(i) + '号玩家:' + str(list[i]) + '票')
            if flag:
                p.RDead = nnow
                newMessage(0, rName, 1 << 12 - 1, str(nnow) + '号玩家被投票死亡！')
            else:
                newMessage(0, rName, 1 << 12 - 1, '无人被投票死亡')
            if p.RDead != 0:
                words = p.RDead
                while words != 0:
                    hunter = 0
                    newMessage(0, rName, 1 << 12 - 1, str(words % 100) + '号玩家昨天晚上死了')
                    User.objects.get(URoom = rName, UOrder = words % 100).UAlive = False
                    if User.objects.get(URoom = rName, UOrder = words % 100).URole == 4:
                        flag1 = True
                        hunter = words % 100
                    if words % 100 == p.RPolice:
                        flag2 = True
                    words = words / 100
                isVictory(rName)
                p.RDead = 0
                if flag1:
                    p.RLast = 12
                    p.RNow = 13
                    p.RSpeak = 0
                    p.RVote = 1 << (hunter - 1)
                    newMessage(0, rName, 1 << 12 - 1, str(hunter) + '号玩家是猎人，请发动技能')
            elif flag2:
                p.RLast = 12
                p.RNow = 14
                p.RSpeak = 0
                p.RVote = 1 << (p.RPolice - 1)
                User.objects.get(URoom = p.RName, UOrder = p.RPolice).UAlive = True
                User.objects.get(URoom = p.RName, UOrder = p.RPolice).save()
                newMessage(0, rName, 1 << 12 - 1, str(p.RPolice) + '号玩家是警长，请传递警徽')
            else:
                p.RNow = 3
                p.RDays = p.RDays + 1
                p.RSpeak = 0
                p.RVote = 0
                for i in range(1, 13):
                    tmp = User.objects.get(URoom = p.RName, UOrder = i)
                    if (tmp.URole == 5) and tmp.UAlive:
                        p.RVote = p.RVote + 1 << (i - 1)
                        p.RSpeak = p.RSpeak + 1 << (i - 1)
                p.Timer = now
        rest = 10 - time
        p.save()
    elif p.RNow == 13:
        if time > 10:
            for i in range(1, 13):
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
                if tmp.URole == 4:
                    if tmp.UVote > 0:
                        if tmp.UVote == p.RPolice:
                            flag2 = True
                    newMessage(0, rName, 1 << 12 - 1, str(tmp.UVote) + '号玩家被猎人杀死了')
                    User.objects.get(URoom = rName, UOrder = tmp.UVote).UAlive = False
                    User.objects.get(URoom = rName, UOrder = tmp.UVote).save()
            isVictory(rName)
            p.RNow = p.RLast
            p.RVote = 0
            p.RSpeak = 0
            p.RTimer = now
            flag1 = False
            clearvote(rName)
        rest = 10 - time
        p.save()
    elif p.RNow == 14:
        if time > 10:
            tmp = User.objects.get(URoom = p.RName, UOrder = p.RPolice)
            if tmp.UVote == 0:
                tmp.UVote = ran(12)
                while (User.objects.get(URoom = p.RName, UOrder = tmp.UVote).UAlive == False) or (tmp.UVote == p.RPolice):
                    tmp.UVote = ran(12)
            p.RPolice = tmp.UVote
            User.objects.get(URoom = p.RName, UOrder = p.RPolice).UAlive = False
            User.objects.get(URoom = p.RName, UOrder = p.RPolice).save()
            p.RNow = p.RLast
            p.RVote = 0
            p.RSpeak = 0
            p.RTimer = now
            flag2 = False
            clearvote(rName)
        rest = 10 - time
        p.save()

    return rest



