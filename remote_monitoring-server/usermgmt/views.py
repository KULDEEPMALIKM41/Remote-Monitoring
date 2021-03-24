
from .models.accounts import User
from .models.accounts import Profile
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from .serializer import ProfileSerializer
from .serializer import UserSerializer
from .serializer import CustomTokenObtainPairSerializer
# from .serializer import ContactSerializer
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
# from .serializer import UserlistlSerializer,UserProfileDetailSerializer
import json
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    # Replace the serializer with your custom
    serializer_class = CustomTokenObtainPairSerializer

class ProfileViewSet(ModelViewSet):

    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)

    @action(detail=True, methods=['post'])
    def highlight(self, request, *args, **kwargs):
        user = request.user
        try:
            userprofile = Profile.objects.filter(user = user)
            if userprofile.exists():
                content = ProfileSerializer(userprofile[0]).data
                return  Response(content, status.HTTP_200_OK)
            else:
                content = UserSerializer(user).data
                return  Response(content, status.HTTP_200_OK)
        except:
            return  Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def get_doctors(self, request , *args, **kwargs):
        symptoms = request.data.get("symptoms")
        specialization = request.data.get("specialization")
        queryset_userprofile = Profile.objects.filter(symptoms__overlap=symptoms) | Profile.objects.filter(specialization__overlap=specialization)
        queryset_userprofile = queryset_userprofile.distinct()
        try:
            content = ProfileSerializer(queryset_userprofile, many=True).data
            # print(content)
        except:
            content = []
        return  Response(content, status.HTTP_200_OK) 

    @action(detail=True, methods=['post'])
    def add_to_contact(self, request , *args, **kwargs):
        author = request.user
        friend = User.objects.get(id=request.data.get('friend'))
        author_profile = Profile.objects.get(user=author)
        friend_profile = Profile.objects.get(user=friend)
        author_profile.contacts.add(friend)
        friend_profile.contacts.add(author)
        dr_name = friend.first_name
        return  Response({'message':'Dr. ' + dr_name + ' added in your contact list.'}, status.HTTP_201_CREATED)    
        
    def create(self, request):
        content = {}
        try:
            if request.data.get('form_type') == 'accountInfo':        
                user = request.user
                user.first_name = request.data.get('first_name')
                user.last_name = request.data.get('last_name')
                user.gender = request.data.get('gender')
                user.save()
                return Response({'message':'Account information Updated.'}, status.HTTP_201_CREATED)

            elif request.data.get('form_type') == 'generalInfo' or request.data.get('form_type') == 'doctorInfo':        
                print(request.data)
                data = request.data
                form_type = request.data.get('form_type')
                if form_type == 'generalInfo':
                    del data['form_type']
                    del data['lang_view']
                elif form_type == 'doctorInfo':
                    del data['form_type']
                    del data['symptoms_view']
                    del data['specialization_view']
                
                profile = Profile.objects.filter(user=request.user)
                if profile.exists():
                    data['user'] = request.user.id
                    profile_serializer = ProfileSerializer(instance=profile[0],  data=data)
                else:
                    data['user'] = request.user.id
                    profile_serializer = ProfileSerializer(data=data)
                if profile_serializer.is_valid():
                    profile_serializer.save()
                    if form_type == 'generalInfo':
                        return Response({'message':'General information Updated.'}, status.HTTP_201_CREATED)
                    elif form_type == 'doctorInfo':
                        return Response({'message':'Doctor information Updated.'}, status.HTTP_201_CREATED)
                else:
                    print(profile_serializer.errors)
                    return Response({'message': str(profile_serializer.errors)}, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status.HTTP_400_BAD_REQUEST)
    
@permission_classes([AllowAny ,])
@api_view(["POST"])
def create_user(request):
        authentication_classes = [AllowAny,]
        user_data = request.data
        password = user_data.get("password")
        email = user_data.get("email")
        username = user_data.get("username")
        name = user_data.get("name")
        if ' ' in name:
            first_name, last_name = name.split(" ")
        else:
            first_name, last_name = name, ''
        user_type = user_data.get("userType")
        if not User.objects.filter(username=username).exists():
            user_serializer = UserSerializer(data={
                'password':password,
                'username': username,
                'email': email,
                'user_type': user_type,
                'first_name': first_name,
                'last_name': last_name
            })

            if user_serializer.is_valid():
                user_instance = user_serializer.save()
                user_instance.set_password(password)
                user_instance.save()
                profile = Profile.objects.create(user=user_instance)
                profile.save()
                return Response({'message':'Account created.'}, status.HTTP_201_CREATED)
            else:
                try:
                    print(user_serializer.errors)
                    return Response({'message': str(user_serializer.errors)}, status.HTTP_400_BAD_REQUEST)
                except Exception as e:
                    return Response({'message': str(e)}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message':'Username is already exists.'}, status.HTTP_400_BAD_REQUEST)























# # class AdminViewSet(ModelViewSet):

# #     serializer_class = ProfileSerializer
# #     permission_classes = (IsAuthenticated,)

# #     @action(detail=True, methods=['get'])
# #     def Adminhighlight(self, request, *args, **kwargs):
# #         # import ipdb;ipdb.set_trace()

# #         username = request.user
# #         print('username =>', username)
# #         # user = User.objects.get(username=username)
# #         # user_type = user.user_type

# #         return username

#         # username = request.user
#         # # user = User.objects.get(username=username)
#         # # user_type = user.user_type



#         # # import ipdb;ipdb.set_trace()
#         # print(user)
#         # try:
#         #     userprofile = Profile.objects.get(user = user)
#         #     content = ProfileSerializer(userprofile).data
#         #     content['user_type'] = user_type
#         #     print(content)
#         # except:
#         #     content = {}
#         # return  Response(content, status.HTTP_201_CREATED)
