import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  FileText,
  Link,
  Image as ImageIcon,
  User,
  Mail,
  Phone,
  Briefcase,
  FolderOpen,
  Sparkles,
  Loader2,
  Pencil,
  Trash2,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { portfolioService } from '@/api/services';
import { getMemberProfileUrl, MEMBER_AVATAR_PLACEHOLDER } from '@/api/config';

const SECTION_STYLE = 'rounded-lg border bg-card p-6 text-card-foreground shadow-sm';

export function ArtistPortfolioPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  // 가져오기: 소스 선택 모달
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState('source'); // 'source' | 'url' | 'image' | 'preview'
  const [pageUrl, setPageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [extractResult, setExtractResult] = useState(null);
  const [extractLoading, setExtractLoading] = useState(false);
  const [savingFromExtract, setSavingFromExtract] = useState(false);

  // 만들기 모달
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [createForm, setCreateForm] = useState({
    portfolioUserName: '',
    portfolioUserPhone: '',
    portfolioUserEmail: '',
    portfolioUserCareer: '',
    portfolioUserProject: '',
    portfolioUserSkill: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notionSyncLoading, setNotionSyncLoading] = useState(false);
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false);

  useEffect(() => {
    let cancelled = false;
    portfolioService
      .getMyPortfolio()
      .then((data) => {
        if (!cancelled) setPortfolio(data && data.portfolioNo ? data : null);
      })
      .catch(() => {
        if (!cancelled) setPortfolio(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const refetchPortfolio = async () => {
    try {
      const res = await portfolioService.getMyPortfolio();
      const data = res?.data ?? res;
      setPortfolio(data && data.portfolioNo ? data : null);
      setHasUnsyncedChanges(false);
    } catch {
      setPortfolio(null);
    }
  };

  const handleNotionConnect = async () => {
    if (!portfolio?.portfolioNo) return;
    setNotionSyncLoading(true);
    try {
      const configRes = await portfolioService.getNotionConfig();
      const config = configRes?.data ?? configRes;
      const { clientId, redirectUri } = config || {};
      if (!clientId || !redirectUri) {
        toast.error('Notion 연동 설정을 불러올 수 없습니다.');
        setNotionSyncLoading(false);
        return;
      }
      const state = JSON.stringify({ portfolioNo: portfolio.portfolioNo });
      const authUrl =
        `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}` +
        `&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${encodeURIComponent(state)}`;
      const popup = window.open(authUrl, 'notion-oauth', 'width=600,height=700');

      let callbackHandled = false;

      const handleMessage = async (event) => {
        if (event.data?.type !== 'notion-callback') return;
        const stateParam = event.data?.state;
        let portfolioNoFromState = null;
        try {
          if (stateParam && typeof stateParam === 'string') {
            const parsed = JSON.parse(stateParam);
            portfolioNoFromState = parsed?.portfolioNo;
          }
        } catch {
          /* ignore */
        }
        if (portfolioNoFromState !== portfolio.portfolioNo) return;
        callbackHandled = true;
        window.removeEventListener('message', handleMessage);
        const { code } = event.data;
        if (!code) {
          toast.error('Notion 인증에 실패했습니다.');
          setNotionSyncLoading(false);
          return;
        }
        try {
          const result = await portfolioService.notionCallback(portfolio.portfolioNo, code);
          const data = result?.data ?? result;
          const pageCreated = data?.pageCreated;
          const notionPageUrl = data?.notionPageUrl;
          await refetchPortfolio();
          if (pageCreated && notionPageUrl) {
            toast.success('Notion 연동이 완료되었습니다.');
            window.open(notionPageUrl, '_blank');
          } else if (data?.workspaceName) {
            toast.success('Notion 계정이 연동되었습니다. 페이지를 생성하지 못했을 수 있습니다.');
          } else {
            toast.error('Notion 인증은 됐지만, 공유된 페이지가 없어 포트폴리오 페이지를 만들 수 없습니다. Notion에서 페이지를 공유한 뒤 다시 시도해 주세요.');
          }
        } catch (err) {
          console.error('Notion callback error:', err);
          toast.error(err?.response?.data?.message || err?.message || 'Notion 연동 중 오류가 발생했습니다.');
        } finally {
          setNotionSyncLoading(false);
        }
      };
      window.addEventListener('message', handleMessage);

      const checkClosed = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(checkClosed);
          if (!callbackHandled) {
            setNotionSyncLoading(false);
            window.removeEventListener('message', handleMessage);
            refetchPortfolio().catch(() => {});
          }
        }
      }, 500);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Notion 설정을 불러올 수 없습니다.');
      setNotionSyncLoading(false);
    }
  };

  const openImportModal = () => {
    setImportModalOpen(true);
    setImportStep('source');
    setPageUrl('');
    setImageFile(null);
    setExtractResult(null);
  };

  const handleExtractByUrl = async () => {
    if (!pageUrl.trim()) {
      toast.error('URL을 입력해 주세요.');
      return;
    }
    setExtractLoading(true);
    try {
      const res = await portfolioService.extractFromPageScreenshot(pageUrl.trim());
      const data = res?.data ?? res;
      setExtractResult(data);
      setImportStep('preview');
    } catch (e) {
      toast.error(e?.message || 'URL에서 포트폴리오를 추출하지 못했습니다.');
    } finally {
      setExtractLoading(false);
    }
  };

  const handleExtractByImage = async () => {
    if (!imageFile) {
      toast.error('이미지 파일을 선택해 주세요.');
      return;
    }
    setExtractLoading(true);
    try {
      const res = await portfolioService.extractFromImage(imageFile);
      const data = res?.data ?? res;
      setExtractResult(data);
      setImportStep('preview');
    } catch (e) {
      toast.error(e?.message || '이미지에서 포트폴리오를 추출하지 못했습니다.');
    } finally {
      setExtractLoading(false);
    }
  };

  const saveFromExtract = async () => {
    if (!extractResult) return;
    setSavingFromExtract(true);
    try {
      await portfolioService.saveFromExtract(extractResult);
      toast.success('포트폴리오가 저장되었습니다.');
      setImportModalOpen(false);
      refetchPortfolio();
    } catch (e) {
      toast.error(e?.message || '저장에 실패했습니다.');
    } finally {
      setSavingFromExtract(false);
    }
  };

  /** • 프로젝트명 (yyyy-MM-dd) - 역할 | 상태 | 플랫폼. 날짜는 project_started_at만 사용 */
  const formatProjectLine = (p) => {
    const name = p.projectName ?? p.projectTitle ?? '';
    if (!name) return '';
    let dateStr = '';
    const startedAt = p.projectStartedAt;
    if (startedAt) {
      if (typeof startedAt === 'string') dateStr = startedAt.slice(0, 10);
      else if (Array.isArray(startedAt) && startedAt.length >= 3)
        dateStr = [startedAt[0], String(startedAt[1]).padStart(2, '0'), String(startedAt[2]).padStart(2, '0')].join('-');
    }
    const role = p.projectMemberRole ?? '담당자';
    const status = p.projectStatus ?? '연재';
    const platform = p.platform ?? '';
    const rest = [role, status, platform].filter(Boolean).join(' | ');
    return rest ? `• ${name}${dateStr ? ` (${dateStr})` : ''} - ${rest}` : `• ${name}${dateStr ? ` (${dateStr})` : ''}`;
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setCreateModalOpen(true);
    setCreateForm({
      portfolioUserName: '',
      portfolioUserPhone: '',
      portfolioUserEmail: '',
      portfolioUserCareer: '',
      portfolioUserProject: '',
      portfolioUserSkill: '',
    });
    portfolioService.getMyProjectsForForm().then((res) => {
      const list = Array.isArray(res) ? res : res?.data ?? [];
      setMyProjects(list);
      if (list.length > 0) {
        const projectText = list.map(formatProjectLine).filter(Boolean).join('\n');
        setCreateForm((f) => ({ ...f, portfolioUserProject: projectText }));
      }
    }).catch(() => setMyProjects([]));
  };

  const handleDeletePortfolio = async () => {
    if (!portfolio?.portfolioNo) return;
    setDeleteLoading(true);
    try {
      await portfolioService.delete(portfolio.portfolioNo);
      setPortfolio(null);
      setDeleteConfirmOpen(false);
      toast.success('포트폴리오가 삭제되었습니다.');
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || '삭제에 실패했습니다.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = () => {
    if (!portfolio) return;
    setIsEditMode(true);
    setCreateModalOpen(true);
    setCreateForm({
      portfolioUserName: portfolio.portfolioUserName ?? '',
      portfolioUserPhone: portfolio.portfolioUserPhone ?? '',
      portfolioUserEmail: portfolio.portfolioUserEmail ?? '',
      portfolioUserCareer: portfolio.portfolioUserCareer ?? '',
      portfolioUserProject: portfolio.portfolioUserProject ?? '',
      portfolioUserSkill: portfolio.portfolioUserSkill ?? '',
    });
    portfolioService.getMyProjectsForForm().then((list) => {
      setMyProjects(Array.isArray(list) ? list : []);
    }).catch(() => setMyProjects([]));
  };

  const submitCreateOrUpdate = async () => {
    setCreateLoading(true);
    try {
      if (isEditMode && portfolio?.portfolioNo) {
        const updated = await portfolioService.update(portfolio.portfolioNo, createForm);
        const data = updated?.data ?? updated;
        if (data && data.portfolioNo) setPortfolio(data);
        setHasUnsyncedChanges(true);
        toast.success('포트폴리오가 수정되었습니다.');
      } else {
        await portfolioService.create(createForm);
        toast.success('포트폴리오가 저장되었습니다.');
        await refetchPortfolio();
      }
      setCreateModalOpen(false);
    } catch (e) {
      toast.error(e?.message || '저장에 실패했습니다.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleNotionRefresh = async () => {
    if (!portfolio?.portfolioNo) return;
    setNotionSyncLoading(true);
    try {
      const res = await portfolioService.syncNotion(portfolio.portfolioNo);
      const data = res?.data ?? res;
      if (data && data.portfolioNo) {
        setPortfolio(data);
        setHasUnsyncedChanges(false);
        toast.success('Notion에 수정 내용이 반영되었습니다.');
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Notion 최신화에 실패했습니다.');
    } finally {
      setNotionSyncLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <FileText className="w-8 h-8" />
          포트폴리오
        </div>
        {portfolio && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={openEditModal}>
              <Pencil className="w-4 h-4" />
              수정
            </Button>
            {portfolio.notionPageUrl ? (
              hasUnsyncedChanges ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={notionSyncLoading}
                  onClick={handleNotionRefresh}
                >
                  {notionSyncLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Notion 최신화
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(portfolio.notionPageUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  Notion에서 보기
                </Button>
              )
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={notionSyncLoading}
                onClick={handleNotionConnect}
              >
                {notionSyncLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Link className="w-4 h-4" />
                )}
                Notion 연동
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </Button>
          </div>
        )}
      </div>

      {!portfolio ? (
        <Card className={SECTION_STYLE}>
          <p className="text-muted-foreground mb-6">아직 등록된 포트폴리오가 없습니다.</p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={openImportModal} size="lg" className="gap-2">
              <Link className="w-5 h-5" />
              포트폴리오 가져오기
            </Button>
            <Button onClick={openCreateModal} variant="outline" size="lg" className="gap-2">
              <Sparkles className="w-5 h-5" />
              포트폴리오 만들기
            </Button>
          </div>
        </Card>
      ) : (
        <Card className={SECTION_STYLE}>
          <div className="space-y-4">
            {(portfolio.profileImage || portfolio.portfolioUserName) && (
              <div className="flex items-center gap-4">
                <img
                  src={getMemberProfileUrl(portfolio.profileImage) ?? MEMBER_AVATAR_PLACEHOLDER}
                  alt="프로필"
                  className="w-16 h-16 rounded-full object-cover border border-border shrink-0"
                />
                {portfolio.portfolioUserName && (
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-muted-foreground shrink-0" />
                    <span className="font-medium">이름</span>
                    <span>{portfolio.portfolioUserName}</span>
                  </div>
                )}
              </div>
            )}
            {portfolio.portfolioUserEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">이메일</span>
                <span>{portfolio.portfolioUserEmail}</span>
              </div>
            )}
            {portfolio.portfolioUserPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">전화</span>
                <span>{portfolio.portfolioUserPhone}</span>
              </div>
            )}
            {portfolio.portfolioUserCareer && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">경력</span>
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded">{portfolio.portfolioUserCareer}</pre>
              </div>
            )}
            {portfolio.portfolioUserProject && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FolderOpen className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">참여 프로젝트</span>
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded">{portfolio.portfolioUserProject}</pre>
              </div>
            )}
            {portfolio.portfolioUserSkill && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">스킬</span>
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded">{portfolio.portfolioUserSkill}</pre>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 가져오기 모달 */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>포트폴리오 가져오기</DialogTitle>
            <DialogDescription>
              {importStep === 'source' && 'URL 또는 이미지에서 정보를 추출해 규격에 맞게 저장합니다.'}
              {importStep === 'url' && '포트폴리오 페이지 URL을 입력하세요. 전체 페이지가 캡처된 뒤 분석됩니다.'}
              {importStep === 'image' && '포트폴리오/이력서 이미지를 선택하세요.'}
              {importStep === 'preview' && '추출된 내용을 확인한 뒤 저장하세요.'}
            </DialogDescription>
          </DialogHeader>

          {importStep === 'source' && (
            <div className="flex flex-col gap-3 pt-2">
              <Button variant="outline" className="justify-start gap-2" onClick={() => setImportStep('url')}>
                <Link className="w-5 h-5" />
                URL 불러오기
              </Button>
              <Button variant="outline" className="justify-start gap-2" onClick={() => setImportStep('image')}>
                <ImageIcon className="w-5 h-5" />
                이미지 불러오기
              </Button>
            </div>
          )}

          {importStep === 'url' && (
            <div className="space-y-3 pt-2">
              <Label>페이지 URL</Label>
              <Input
                placeholder="https://..."
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setImportStep('source')}>뒤로</Button>
                <Button onClick={handleExtractByUrl} disabled={extractLoading}>
                  {extractLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '추출하기'}
                </Button>
              </div>
            </div>
          )}

          {importStep === 'image' && (
            <div className="space-y-3 pt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setImportStep('source')}>뒤로</Button>
                <Button onClick={handleExtractByImage} disabled={extractLoading || !imageFile}>
                  {extractLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '추출하기'}
                </Button>
              </div>
            </div>
          )}

          {importStep === 'preview' && extractResult && (
            <div className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto">
              <div className="text-sm space-y-1">
                {extractResult.name && <p><strong>이름</strong> {extractResult.name}</p>}
                {extractResult.role && <p><strong>직무</strong> {extractResult.role}</p>}
                {extractResult.email && <p><strong>이메일</strong> {extractResult.email}</p>}
                {extractResult.phone && <p><strong>전화</strong> {extractResult.phone}</p>}
                {extractResult.careerItems?.length > 0 && (
                  <p><strong>경력</strong> {extractResult.careerItems.join(' / ')}</p>
                )}
                {extractResult.projects?.length > 0 && (
                  <p><strong>프로젝트</strong> {extractResult.projects.join(', ')}</p>
                )}
                {extractResult.skills?.length > 0 && (
                  <p><strong>스킬</strong> {extractResult.skills.join(', ')}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setImportStep('source')}>취소</Button>
                <Button onClick={saveFromExtract} disabled={savingFromExtract}>
                  {savingFromExtract ? <Loader2 className="w-4 h-4 animate-spin" /> : '규격에 맞게 저장'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 만들기/수정 모달 */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? '포트폴리오 수정' : '포트폴리오 만들기'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? '내용을 수정한 뒤 저장하세요.' : '참여 프로젝트와 기본 정보를 입력해 포트폴리오를 작성합니다.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 pt-2">
            <div>
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={createForm.portfolioUserName}
                onChange={(e) => setCreateForm((f) => ({ ...f, portfolioUserName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">전화</Label>
              <Input
                id="phone"
                value={createForm.portfolioUserPhone}
                onChange={(e) => setCreateForm((f) => ({ ...f, portfolioUserPhone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={createForm.portfolioUserEmail}
                onChange={(e) => setCreateForm((f) => ({ ...f, portfolioUserEmail: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="career">경력</Label>
              <textarea
                id="career"
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={createForm.portfolioUserCareer}
                onChange={(e) => setCreateForm((f) => ({ ...f, portfolioUserCareer: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="project">참여 프로젝트</Label>
              <textarea
                id="project"
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={createForm.portfolioUserProject}
                onChange={(e) => setCreateForm((f) => ({ ...f, portfolioUserProject: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="skill">스킬</Label>
              <textarea
                id="skill"
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={createForm.portfolioUserSkill}
                onChange={(e) => setCreateForm((f) => ({ ...f, portfolioUserSkill: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>취소</Button>
            <Button onClick={submitCreateOrUpdate} disabled={createLoading}>
              {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditMode ? '수정 완료' : '저장'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 모달 */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>포트폴리오 삭제</DialogTitle>
            <DialogDescription>
              포트폴리오를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={deleteLoading}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePortfolio}
              disabled={deleteLoading}
            >
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '삭제'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
