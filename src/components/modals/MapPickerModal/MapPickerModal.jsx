import { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { MapPin, Loader2, Search } from 'lucide-react';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
`;

const MapFallback = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: var(--muted);
  border-radius: 8px;
  color: var(--muted-foreground);
  font-size: 14px;
`;

const SelectedAddress = styled.p`
  font-size: 14px;
  color: var(--foreground);
  margin: 0;
  padding: 12px;
  background-color: var(--muted);
  border-radius: 6px;
  border: 1px solid var(--border);
`;

const AddressSearchRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

/** Plus Code 패턴 (예: MC44+F8V) - 사람이 읽기 어려운 형식 */
const PLUS_CODE_PATTERN = /^[A-Z0-9]{4,}\+[A-Z0-9]{2,}/i;

/** formatted_address가 Plus Code로 시작하는지 확인 */
const startsWithPlusCode = (addr) => addr && PLUS_CODE_PATTERN.test(addr.trim());

/** address_components로 사람이 읽기 쉬운 주소 문자열 생성 */
function buildAddressFromComponents(components) {
  const get = (types) => {
    const c = components.find((x) => types.some((t) => x.types.includes(t)));
    return c?.long_name || '';
  };
  const raw = [
    get(['street_number']),
    get(['route']),
    get(['sublocality', 'sublocality_level_1', 'sublocality_level_2']),
    get(['locality']),
    get(['administrative_area_level_1']),
    get(['administrative_area_level_2']),
    get(['country']),
    get(['postal_code']),
  ].filter(Boolean);
  const parts = raw.filter((p, i) => p !== raw[i - 1]);
  return parts.join(', ') || null;
}

/** Geocoding 결과에서 Plus Code 대신 사람이 읽기 쉬운 주소 선별 */
function pickHumanReadableAddress(results) {
  for (const r of results) {
    const formatted = (r.formatted_address || '').trim();
    if (!formatted) continue;
    if (!startsWithPlusCode(formatted)) {
      return formatted;
    }
    const fromComponents = buildAddressFromComponents(r.address_components || []);
    if (fromComponents) return fromComponents;
    const afterComma = formatted.includes(',') ? formatted.split(',').slice(1).join(',').trim() : '';
    if (afterComma) return afterComma;
  }
  return results[0]?.formatted_address || null;
}

function MapContent({ position, onPositionChange, onAddressResolved }) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      map.panTo(position);
    }
  }, [map, position?.lat, position?.lng]);

  const reverseGeocode = useCallback(
    async (lat, lng) => {
      if (!window.google?.maps?.Geocoder) return null;
      setIsGeocoding(true);
      try {
        const geocoder = new window.google.maps.Geocoder();
        return new Promise((resolve) => {
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            setIsGeocoding(false);
            if (status !== 'OK' || !results || results.length === 0) {
              resolve(null);
              return;
            }
            const addr = pickHumanReadableAddress(results);
            if (addr) {
              onAddressResolved?.(addr);
              resolve(addr);
            } else {
              resolve(null);
            }
          });
        });
      } catch {
        setIsGeocoding(false);
        return null;
      }
    },
    [onAddressResolved]
  );

  const handleMapClick = useCallback(
    (event) => {
      const latLng = event.detail?.latLng ?? event.latLng;
      if (!latLng) return;
      const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
      const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
      if (lat != null && lng != null) {
        onPositionChange({ lat, lng });
        reverseGeocode(lat, lng);
      }
    },
    [onPositionChange, reverseGeocode]
  );

  return (
    <>
      <div style={{ width: '100%', height: '100%', minHeight: 400 }}>
        <Map
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
        >
          {position && (
            <Marker position={position} title="선택한 장소" />
          )}
        </Map>
      </div>
      {isGeocoding && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            backgroundColor: 'var(--card)',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: 14,
            color: 'var(--foreground)',
          }}
        >
          <Loader2 size={16} className="animate-spin" />
          주소 조회 중...
        </div>
      )}
    </>
  );
}

/**
 * 지도에서 클릭하여 장소를 선택하고 주소를 가져오는 모달
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {(address: string) => void} props.onSelect - 주소 선택 시 콜백
 */
export function MapPickerModal({ open, onOpenChange, onSelect }) {
  const [position, setPosition] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleAddressResolved = (addr) => {
    setSelectedAddress(addr || '');
  };

  const handleAddressSearch = useCallback(async () => {
    const addr = addressInput.trim();
    if (!addr || !window.google?.maps?.Geocoder) return;
    setIsSearching(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: addr }, (results, status) => {
        setIsSearching(false);
        if (status !== 'OK' || !results || results.length === 0) return;
        const loc = results[0].geometry?.location;
        if (!loc) return;
        const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
        const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
        setPosition({ lat, lng });
        const resolved = pickHumanReadableAddress(results);
        if (resolved) setSelectedAddress(resolved);
      });
    } catch {
      setIsSearching(false);
    }
  }, [addressInput]);

  const handleConfirm = () => {
    if (selectedAddress) {
      onSelect?.(selectedAddress.slice(0, 100));
      onOpenChange(false);
      setPosition(null);
      setSelectedAddress('');
      setAddressInput('');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setPosition(null);
    setSelectedAddress('');
    setAddressInput('');
  };

  if (!apiKey) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>지도에서 장소 선택</DialogTitle>
          </DialogHeader>
          <MapFallback>
            <MapPin size={48} />
            <p>지도 기능을 사용하려면 <code>VITE_GOOGLE_MAPS_API_KEY</code>를 환경 변수에 설정해주세요.</p>
            <p className="text-xs">frontend/.env 파일에 추가 후 서버를 재시작하세요.</p>
          </MapFallback>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>지도에서 장소 선택</DialogTitle>
        </DialogHeader>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: 0 }}>
          주소를 검색하거나 지도를 클릭하여 워케이션 장소를 선택하세요.
        </p>
        <AddressSearchRow>
          <Input
            placeholder="주소 검색 (예: 서울시 강남구 역삼동 123-45)"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
            className="flex-1"
            style={{ color: 'var(--foreground)' }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddressSearch}
            disabled={!addressInput.trim() || isSearching}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            검색
          </Button>
        </AddressSearchRow>
        <MapContainer style={{ position: 'relative' }}>
          <MapContent
            position={position}
            onPositionChange={setPosition}
            onAddressResolved={handleAddressResolved}
          />
        </MapContainer>
        {selectedAddress && (
          <div>
            <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 8 }}>
              선택한 주소
            </p>
            <SelectedAddress>{selectedAddress}</SelectedAddress>
          </div>
        )}
        <DialogFooter style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedAddress}>
            이 주소 사용
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
