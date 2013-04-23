from django.conf.urls import patterns, include, url

urlpatterns = patterns('',

    url(r'^$', 'comforttool.ash55.views.index')

)
